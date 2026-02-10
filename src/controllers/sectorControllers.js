const {
  createSectorService,
  listSectorsService,
  updateSectorService,
  deleteSectorService,
  assignSectorAdminService,
  createSectorLevelUserService,
  updateSectorLevelUserService,
  createOwnSectorUserService,
  updateOwnSectorUserService,
} = require("../services/sectorService");

const createSectorLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const assignment = await createSectorLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Sector Level User created successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

const updateSectorLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const result = await updateSectorLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Sector Level User updated successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const createOwnSectorUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const assignment = await createOwnSectorUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Sector User created successfully (Self-Management)",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

const updateOwnSectorUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const result = await updateOwnSectorUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Sector User updated successfully (Self-Management)",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const createSectorController = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newSector = await createSectorService(name, req.user);
    res.status(201).json({
      success: true,
      message: "Sector created successfully",
      sector: newSector,
    });
  } catch (error) {
    next(error);
  }
};

const listSectorsController = async (req, res, next) => {
  try {
    const sectors = await listSectorsService(req.user);
    res.status(200).json({
      success: true,
      sectors,
    });
  } catch (error) {
    next(error);
  }
};

const updateSectorController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedSector = await updateSectorService(id, name, req.user);
    res.status(200).json({
      success: true,
      message: "Sector updated successfully",
      sector: updatedSector,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSectorController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteSectorService(id, req.user);
    res.status(200).json({
      success: true,
      message: "Sector deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const assignSectorAdminController = async (req, res, next) => {
  try {
    const { userId, sectorId, permissions } = req.body;

    const assignment = await assignSectorAdminService({
      userId,
      sectorId,
      permissions,
      currentUser: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Sector Admin assigned successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createSectorController,
  listSectorsController,
  updateSectorController,
  deleteSectorController,
  assignSectorAdminController,
  createSectorLevelUserController,
  updateSectorLevelUserController,
  createOwnSectorUserController,
  updateOwnSectorUserController,
};
