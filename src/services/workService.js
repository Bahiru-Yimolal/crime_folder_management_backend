const Subcity = require("../models/subcityModel");
const WorkHistory = require("../models/workHistoryModel");
const Sector = require("../models/sectorModel");
const Profile = require("../models/profileModel");
const Plan = require("../models/planModel");
const { AppError } = require("../middlewares/errorMiddleware");
const { Op } = require("sequelize");
const fs = require("fs");
const paths = require("path");


const path = process.env.BASE_FILE_URL || "http://localhost:5000/uploads/";

const createWorkService = async (workData) => {
  const {
    organization,
    courseType,
    sector,
    date,
    isComplete ,
    certificateLink,
    profile_id,
    certificate,
  } = workData;

  // Optional: Check if profile exists before adding work history
  const profileExists = await Profile.findByPk(profile_id);
  if (!profileExists) {
    throw new AppError("User Profile with this ID not found", 404);
  }

    // 2. Check if courseType already exists for this profile
    const existingWork = await WorkHistory.findOne({
      where: {
        registered_by: profile_id,
        courseType,
      },
    });
  
    if (existingWork) {
      throw new AppError(`Certificate "${courseType}" already exists please upload other Certificate`, 400);
    }

  const newWork = await WorkHistory.create({
    registered_by: profile_id,
    organization,
    courseType,
    sector,
    date,
    isComplete,
    certificateLink,
    certificate,
  });

  return newWork;
};

const getWorkHistoryService = async (profileId) => {
  const workHistories = await WorkHistory.findAll({
    where: { registered_by: profileId },
    order: [["created_at", "DESC"]],
    raw: true,
  });

  // Convert workFile field to a URL if it exists
  for (const work of workHistories) {
    if (work.certificate) {
      work.certificate = `${path}${work.certificate}`;
    }
  }

  return workHistories;
};

const getSectorWorkHistoryService = async (sector_id) => {
  const sector = await Sector.findByPk(sector_id);

  if (!sector) {
    throw new AppError("Sector not found", 404);
  }
   console.log(sector.sector_name);
  const workHistories = await WorkHistory.findAll({
    where: { sector: sector.sector_name },
    order: [["created_at", "DESC"]],
    raw: true,
  });

  // Convert workFile field to a URL if it exists
  for (const work of workHistories) {
    if (work.certificate) {
      work.certificate = `${path}${work.workFile}`;
    }
  }

  return workHistories;
};

const getAllWorkHistoryService = async () => {
  const workHistories = await WorkHistory.findAll({
    order: [["created_at", "DESC"]],
    raw: true,
  });

  // Convert workFile field to a URL if it exists
  for (const work of workHistories) {
    if (work.certificate) {
      work.certificate = `${path}${work.workFile}`;
    }
  }

  return workHistories;
};

const deleteWorkHistoryService = async (work_history_id) => {
  const work = await WorkHistory.findOne({
    where: { work_history_id: work_history_id },
  });

  if (!work) return null;

  await WorkHistory.destroy({
    where: { work_history_id: work_history_id },
  });

  return true;
};

const updateWorkHistoryService = async (id, updateData) => {
  const work = await WorkHistory.findByPk(id);
  // console.log(work);
  // console.log(work.certificate);

  if (!work) {
    throw new AppError("Certificate not found for the user", 400);
  }

  if (work.certificate) {
    const filePath = paths.join(__dirname, "../uploads", work.certificate);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Error deleting file:", err);
        throw new AppError("Failed to delete the old file", 500);
      }
    });
  }

  if (!work) return null;

  await work.update(updateData);

  return work;
};



const CERTIFICATE_TYPES = [
  "ፈንዳሜንታል ፕሮግራሚንግ",
  "አንድሮይድ ፕሮግራሚንግ",
  "ዳታ ሳይንስ",
  "አርቴፊሻል ኢንተለጀንስ",
];

const generateTrainingReportService = async ({ isComplete, startDate, endDate }) => {
  // 1. Fetch relevant work history
  const records = await WorkHistory.findAll({
    where: {
      isComplete,
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Profile,
        attributes: ["sex"],
      },
    ],
  });

  const report = {};

  for (const record of records) {
    const sector = record.sector || "Unknown Sector";
    const course = record.courseType;
    const sex = record.Profile.sex;

    if (!report[sector]) {
      report[sector] = {};

      for (const type of CERTIFICATE_TYPES) {
        report[sector][type] = { male: 0, female: 0, sum: 0 };
      }

      report[sector]["certified"] = { male: 0, female: 0, sum: 0 };
      report[sector]["fullyCertified"] = { male: 0, female: 0, sum: 0 };
    }

    // Count course-specific values
    if (CERTIFICATE_TYPES.includes(course)) {
      report[sector][course][sex === "male" ? "male" : "female"] += 1;
      report[sector][course].sum += 1;
    }

    // Count certified
    report[sector]["certified"][sex === "male" ? "male" : "female"] += 1;
    report[sector]["certified"].sum += 1;
  }

  // Fully certified logic
  const profileMap = {};

  for (const record of records) {
    const profileId = record.registered_by;
    const sector = record.sector || "Unknown Sector";
    const sex = record.Profile.sex;

    if (!profileMap[sector]) profileMap[sector] = {};

    if (!profileMap[sector][profileId]) {
      profileMap[sector][profileId] = {
        sex,
        certificates: new Set(),
      };
    }
    profileMap[sector][profileId].certificates.add(record.courseType);
  }

  for (const [sector, users] of Object.entries(profileMap)) {
    for (const user of Object.values(users)) {
      if (CERTIFICATE_TYPES.every((type) => user.certificates.has(type))) {
        report[sector]["fullyCertified"][user.sex === "male" ? "male" : "female"] += 1;
        report[sector]["fullyCertified"].sum += 1;
      }
    }
  }

  // 2. Format full sector report
  const data = [];

  for (const [sector, dataObj] of Object.entries(report)) {
    data.push({
      sector,
      ...dataObj,
    });
  }

  // 3. Create summary with plan and percentage
  const summary = [];

  for (const item of data) {
    const sectorName = item.sector;
    const certifiedSum = item.certified?.sum || 0;

    const planRecord = await Plan.findOne({ where: { sector: sectorName } });
    const plan = planRecord ? planRecord.plan : 0;

    const percentage = plan > 0 ? ((certifiedSum / plan) * 100).toFixed(2) + "%" : "0.00%";

    summary.push({
      sector: sectorName,
      plan,
      certified: certifiedSum,
      percentage,
    });
  }

  return {
    summary,
    data,
  };
};



const generateSectorTrainingReportService = async ({
  isComplete,
  startDate,
  endDate,
  id,
  role,
}) => {
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

  // 2. Get work history records for this sector only
  const records = await WorkHistory.findAll({
    where: {
      isComplete: isComplete,
      date: {
        [Op.between]: [startDate, endDate],
      },
      sector: sectorName,
    },
    include: [
      {
        model: Profile,
        attributes: ["sex"],
      },
    ],
  });

  // 3. Initialize report object for the sector
  const report = {
    sector: sectorName,
  };

  for (const type of CERTIFICATE_TYPES) {
    report[type] = { male: 0, female: 0, sum: 0 };
  }

  report["certified"] = { male: 0, female: 0, sum: 0 };
  report["fullyCertified"] = { male: 0, female: 0, sum: 0 };

  // 4. Count certificates
  for (const record of records) {
    const course = record.courseType;
    const sex = record.Profile?.sex?.toLowerCase();

    if (!sex || !["male", "female"].includes(sex)) continue;

    if (CERTIFICATE_TYPES.includes(course)) {
      report[course][sex] += 1;
      report[course].sum += 1;
    }

    report["certified"][sex] += 1;
    report["certified"].sum += 1;
  }

  // 5. Count fully certified
  const profileMap = {};
  for (const record of records) {
    const profileId = record.registered_by;
    const sex = record.Profile?.sex?.toLowerCase();

    if (!sex || !["male", "female"].includes(sex)) continue;

    if (!profileMap[profileId]) {
      profileMap[profileId] = {
        sex,
        certificates: new Set(),
      };
    }

    profileMap[profileId].certificates.add(record.courseType);
  }

  for (const user of Object.values(profileMap)) {
    if (CERTIFICATE_TYPES.every((type) => user.certificates.has(type))) {
      report["fullyCertified"][user.sex] += 1;
      report["fullyCertified"].sum += 1;
    }
  }

  // 6. Fetch plan
  const planEntry = await Plan.findOne({ where: { sector: sectorName } });
  const planValue = planEntry?.plan || 0;
  const certifiedTotal = report["certified"].sum;
  const percentage =
    planValue > 0 ? Math.round((certifiedTotal / planValue) * 100) : 0;

  return {
    data: report,
    summary: {
      plan: planValue,
      certifiedTotal,
      percentage,
    },
  };
};


module.exports = {
  createWorkService,
  getWorkHistoryService,
  deleteWorkHistoryService,
  updateWorkHistoryService,
  getSectorWorkHistoryService,
  getAllWorkHistoryService,
  generateTrainingReportService,
  generateSectorTrainingReportService,
};
