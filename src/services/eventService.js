const Sector = require("../models/sectorModel");
const Event = require("../models/eventModel");
const QRform = require("../models/qrFormModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op, fn, col, literal } = require("sequelize");
const fs = require("fs");
const paths = require("path");
const Subcity = require("../models/subcityModel");



const path = process.env.BASE_FILE_URL || "http://localhost:5000/uploads/";


const createEventService = async (profileData, role, id) => {
  const {
    title,
    subTitle,
    description,
    placeOfEvent,
    state,
    noOfParticipant,
    realParticipant,
    date,
    photos,
    attendance,
    attendantPhoto,
    visiblity,
  } = profileData;

  let sector;
  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) throw new AppError("Subcity not found", 404);
    sector = subcity.subcity_name;
  } else {
    const sectorData = await Sector.findByPk(id);
    if (!sectorData) throw new AppError("Sector not found", 404);
    sector = sectorData.sector_name;
  }

  const newEvent = await Event.create({
    title,
    subTitle,
    description,
    sector,
    placeOfEvent,
    state,
    noOfParticipant,
    realParticipant,
    date,
    photos,
    attendance,
    attendantPhoto,
    visiblity,
  });

  return newEvent;
};


const getEventSectorService = async (id, role) => {
  let sectorName;

  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) {
      throw new AppError("Subcity not found", 404);
    }
    sectorName = subcity.subcity_name;
  } else {
    const sector = await Sector.findByPk(id);
    if (!sector) {
      throw new AppError("Sector not found", 404);
    }
    sectorName = sector.sector_name;
  }

  // Fetch all event fields for the user's sector
  const events = await Event.findAll({
    where: { sector: sectorName },
    order: [["created_at", "DESC"]],
  });

  if (!events) return null;

  // Add full URL to photos (if any)
  events.forEach((event) => {
    ["photos", "attendance", "attendantPhoto"].forEach((field) => {
      if (event[field] && Array.isArray(event[field])) {
        event[field] = event[field].map((file) => `${path}${file}`);
      }
    });
  });

  return events;
};


const getEventSectorNameService = async (sector) => {

  // Fetch all event fields for the user's sector
  const events = await Event.findAll({
    where: { sector },
    order: [["created_at", "DESC"]],
  });

  if (!events) return null;

  // Add full URL to photos (if any)
  events.forEach((event) => {
    ["photos", "attendance", "attendantPhoto"].forEach((field) => {
      if (event[field] && Array.isArray(event[field])) {
        event[field] = event[field].map((file) => `${path}${file}`);
      }
    });
  });

  return events;
};


const getEventsService = async () => {
  const profiles = await Event.findAll({
    where: { visiblity: "public" },
    order: [["created_at", "DESC"]],
    attributes: {
      exclude: ["realParticipant", "attendance", "attendantPhoto"],
    },
  });

  if (!profiles) return null;

  // Add full URL to photos if needed
  profiles.forEach((profile) => {
    if (profile.photos && Array.isArray(profile.photos)) {
      profile.photos = profile.photos.map((file) => `${path}${file}`);
    }
  });

  return profiles;
};

const deleteOneEventService = async (event_id) => {
  const event = await Event.findByPk(event_id);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  // Check for any associated QR forms
  const associatedForms = await QRform.findOne({
    where: { event_id },
  });

  if (associatedForms) {
    throw new AppError(
      "This event has associated participant-submitted forms and cannot be deleted",
      400
    );
  }

  await event.destroy();

  return { message: "Event deleted successfully" };
};


const addSingleFileService = async (event_id, column_name, newFileNames) => {
  const event = await Event.findByPk(event_id);

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const existingFiles = event[column_name] || [];

  const updatedFiles = [...existingFiles, ...newFileNames];

  event[column_name] = updatedFiles;
  event.changed(column_name, true);

  await event.save();

  return true;
};



const deleteSingleFileService = async (event_id, delete_file_name, column_name) => {
  const profile = await Event.findByPk(event_id);

  if (!profile) {
    throw new AppError("Event not found", 404);
  }

  const currentFiles = profile[column_name] || [];

  if (!currentFiles.includes(delete_file_name)) {
    throw new AppError("File not found in the specified column", 404);
  }

  const updatedFiles = currentFiles.filter((file) => file !== delete_file_name);

  const uploadPath = paths.join(__dirname, "../uploads", delete_file_name);

  fs.unlink(uploadPath, async (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error deleting file:", err);
      throw new AppError("Failed to delete file from server", 400);
    }

    await profile.update({ [column_name]: updatedFiles });
  });
};


const updateEventService = async (profileData, event_id, role, id) => {
  const {
    title,
    subTitle,
    description,
    placeOfEvent,
    state,
    noOfParticipant,
    realParticipant,
    date,
    visiblity,
  } = profileData;

  const profile = await Event.findByPk(event_id);

  if (!profile) {
    throw new AppError("Event not found", 404);
  }

  profile.title = title || profile.title;
  profile.subTitle = subTitle || profile.subTitle;
  profile.description = description || profile.description;
  profile.sector = profile.sector;
  profile.placeOfEvent = placeOfEvent || profile.placeOfEvent;
  profile.state = state || profile.state;
  profile.noOfParticipant = noOfParticipant || profile.noOfParticipant;
  profile.realParticipant = realParticipant || profile.realParticipant;
  profile.date = date || profile.date;
  profile.visiblity = visiblity || profile.visiblity;

  await profile.save();

  return profile;
};


const generateEventReportService = async ({ startDate, endDate }) => {
  // Step 1: Query Events and their planned participants grouped by sector
  const eventStats = await Event.findAll({
    attributes: [
      "sector",
      [fn("COUNT", col("event_id")), "totalEvents"],
      [fn("SUM", col("noOfParticipant")), "noOfParticipant"],
    ],
    where: {
      state: "done", // ✅ Inside where
      visiblity: "public", // ✅ Inside where
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    group: ["sector"],
  });
  

  const results = [];

  for (const eventGroup of eventStats) {
    const sector = eventGroup.sector;
    const totalEvents = parseInt(eventGroup.dataValues.totalEvents);
    const noOfParticipant = parseInt(eventGroup.dataValues.noOfParticipant);

    // Step 2: Fetch associated QRform participant counts by gender for events in this sector and date range
    const qrStats = await QRform.findAll({
      attributes: [
        [
          literal(`COUNT(CASE WHEN gender = 'Male' THEN 1 END)`),
          "totalMaleParticipants",
        ],
        [
          literal(`COUNT(CASE WHEN gender = 'Female' THEN 1 END)`),
          "totalFemaleParticipants",
        ],
      ],
      include: [
        {
          model: Event,
          attributes: [], // exclude event attributes
          where: {
            sector,
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
      raw: true,
    });

    const totalMaleParticipants = parseInt(
      qrStats[0].totalMaleParticipants || 0
    );
    const totalFemaleParticipants = parseInt(
      qrStats[0].totalFemaleParticipants || 0
    );
    const totalParticipants = totalMaleParticipants + totalFemaleParticipants;

    const executionPercentage =
      noOfParticipant > 0
        ? `${((totalParticipants / noOfParticipant) * 100).toFixed(2)}%`
        : "0%";

    results.push({
      sector,
      totalEvents,
      noOfParticipant,
      totalMaleParticipants,
      totalFemaleParticipants,
      totalParticipants,
      executionPercentage,
    });
  }

  return results;
};


const generateEventSuperReportService = async ({ startDate, endDate }) => {
  const stats = await Event.findAll({
    attributes: [
      "sector",
      [fn("COUNT", col("event_id")), "totalEvents"],
      [fn("SUM", col("noOfParticipant")), "TotalNoOfParticipant"],
      [fn("SUM", col("realParticipant")), "totalRealParticipant"],
    ],
    where: {
      state: "done",
      visiblity: "public",
      date: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    },
    group: ["sector"],
    raw: true,
  });

  // Add executionPercentage
  const formatted = stats.map((item) => {
    const noPlanned = parseInt(item.TotalNoOfParticipant) || 0;
    const noReal = parseInt(item.totalRealParticipant) || 0;

    return {
      sector: item.sector,
      totalEvents: parseInt(item.totalEvents),
      TotalNoOfParticipant: noPlanned,
      totalRealParticipant: noReal,
      executionPercentage:
        noPlanned === 0 ? "0%" : `${Math.round((noReal / noPlanned) * 100)}%`,
    };
  });

  return formatted;
};





const createQRFormService = async (formData) => {
  const {
    fullName,
    sector,
    rate,
    gender,
    deviceAddress,
    deviceLocation,
    event_id,
  } = formData;

  // 1. Ensure event exists
  const event = await Event.findByPk(event_id);
  if (!event) {
    throw new AppError("Associated event not found", 404);
  }

  // 2. Prevent duplicate submission from the same device for the same event
  const existingSubmission = await QRform.findOne({
    where: {
      event_id,
      deviceAddress,
    },
  });

  if (existingSubmission) {
    throw new AppError(
      "This device has already submitted the form for this event.",
      409
    );
  }

  // 3. Create new submission
  const newQRForm = await QRform.create({
    fullName,
    sector,
    rate,
    gender,
    deviceAddress,
    deviceLocation,
    event_id,
  });

  return newQRForm;
};


const getFormsByEventService = async (eventId) => {
  // Check if the event exists
  const eventExists = await Event.findByPk(eventId);
  if (!eventExists) {
    throw new AppError("Event not found", 404);
  }

  // Fetch all forms for the event
  const forms = await QRform.findAll({
    where: { event_id: eventId },
    order: [["created_at", "DESC"]],
  });

  return forms;
};



const generateSecotrEventReportService = async ({ startDate, endDate, id, role }) => {
  let sectorName;

  // 1. Get sector/subcity name based on role
  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) throw new AppError("Subcity not found", 404);
    sectorName = subcity.subcity_name;
  } else {
    const sector = await Sector.findByPk(id);
    if (!sector) throw new AppError("Sector not found", 404);
    sectorName = sector.sector_name;
  }

  // 2. Find events within date range and sector
  const events = await Event.findAll({
    where: {
      sector: sectorName,
      state: "done",
      visiblity: "public",
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: ["event_id", "noOfParticipant", "title"],
  });

  if (events.length === 0) {
    return [];
  }

  // 3. Generate report for each event
  const report = await Promise.all(events.map(async (event) => {
    const forms = await QRform.findAll({
      where: { event_id: event.event_id },
      attributes: ["gender"],
    });

    let totalMale = 0;
    let totalFemale = 0;

    forms.forEach(form => {
      if (form.gender === "Male") totalMale++;
      else if (form.gender === "Female") totalFemale++;
    });

    const totalParticipants = totalMale + totalFemale;
    const executionPercentage = event.noOfParticipant === 0
      ? "0%"
      : `${((totalParticipants / event.noOfParticipant) * 100).toFixed(2)}%`;

    return {
      event: event.title,
      noOfParticipant: event.noOfParticipant,
      totalMaleParticipants: totalMale,
      totalFemaleParticipants: totalFemale,
      totalParticipants,
      executionPercentage
    };
  }));

  return report;
};


const deleteExpiredUpcomingEvents = async () => {
  try {
    const now = new Date();

    const deletedCount = await Event.destroy({
      where: {
        state: "upcoming",
        date: {
          [Op.lt]: now,
        },
      },
    });

    if (deletedCount > 0) {
      console.log(`[Event Cleanup] Deleted ${deletedCount} expired upcoming event(s).`);
    }
  } catch (error) {
    console.error("[Event Cleanup] Error deleting expired events:", error);
  }
};

const getEventService = async (eventId) => {
  const profiles = await Event.findOne({
    where: { event_id: eventId },
    attributes: {
      exclude: ["realParticipant", "attendance", "attendantPhoto","photos"],
    },
  });

  if (!profiles) return null;


  return profiles;
};



const generateSecotrAdminEventReportService = async ({
  startDate,
  endDate,
  id,
  role,
}) => {

  let sectorName;

  // Determine sector or subcity name
  if (role === "Sub-City Head") {
    const subcity = await Subcity.findByPk(id);
    if (!subcity) throw new AppError("Subcity not found", 404);
    sectorName = subcity.subcity_name;
  } else {
    const sector = await Sector.findByPk(id);
    if (!sector) throw new AppError("Sector not found", 404);
    sectorName = sector.sector_name;
  }

  // Fetch events in date range and sector
  const events = await Event.findAll({
    where: {
      sector: sectorName,
      state: "done",
      visiblity: "public",
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: ["title", "noOfParticipant", "realParticipant"],
    order: [["date", "ASC"]],
  });

  // Format report
  const report = events.map((event) => {
    const noOfParticipant = event.noOfParticipant || 0;
    const realParticipant = event.realParticipant || 0;
    const executionPercentage =
      noOfParticipant === 0
        ? "0%"
        : `${Math.round((realParticipant / noOfParticipant) * 100)}%`;

    return {
      event: event.title,
      noOfParticipant,
      realParticipant,
      executionPercentage,
    };
  });

  return report;
};

module.exports = {
  createEventService,
  getEventSectorService,
  getEventsService,
  deleteOneEventService,
  updateEventService,
  generateEventReportService,
  getFormsByEventService,
  createQRFormService,
  generateSecotrEventReportService,
  deleteExpiredUpcomingEvents,
  addSingleFileService,
  deleteSingleFileService,
  getEventService,
  getEventSectorNameService,
  generateSecotrAdminEventReportService,
  generateEventSuperReportService,
};
