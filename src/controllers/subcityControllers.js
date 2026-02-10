const {
  createSubcityService,
  listSubcitiesService,
  updateSubcityService,
  deleteSubcityService,
  assignSubcityAdminService,
  createCityLevelUserService,
  updateCityLevelUserService,
} = require("../services/subcityService");

const createSubcityController = async (req, res, next) => {
  try {
    const { name } = req.body;
    // req.user is populated by authMiddleware and assignmentMiddleware
    const newSubcity = await createSubcityService(name, req.user);

    res.status(201).json({
      success: true,
      message: "Subcity created successfully",
      subcity: newSubcity,
    });
  } catch (error) {
    next(error);
  }
};

const listSubcitiesController = async (req, res, next) => {
  try {
    const subcities = await listSubcitiesService(req.user);

    res.status(200).json({
      success: true,
      subcities,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubcityController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedSubcity = await updateSubcityService(id, name, req.user);

    res.status(200).json({
      success: true,
      message: "Subcity updated successfully",
      subcity: updatedSubcity,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubcityController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteSubcityService(id, req.user);

    res.status(200).json({
      success: true,
      message: "Subcity deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const assignSubcityAdminController = async (req, res, next) => {
  try {
    const { userId, subcityId, permissions } = req.body;

    const assignment = await assignSubcityAdminService({
      userId,
      subcityId,
      permissions,
      currentUser: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Subcity Admin assigned successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

const createCityLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions  } = req.body; // Matches validator schema

    const assignment = await createCityLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(201).json({
      success: true,
      message: "City Level User created successfully",
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

const updateCityLevelUserController = async (req, res, next) => {
  try {
    const { user_id, role, permissions } = req.body;

    const result = await updateCityLevelUserService({
      userId: user_id,
      roleName: role,
      permissions,
      actor: req.user,
    });

    res.status(200).json({
      success: true,
      message: "Subcity Level User updated successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubcityController,
  listSubcitiesController,
  updateSubcityController,
  deleteSubcityController,
  assignSubcityAdminController,
  createCityLevelUserController,
  updateCityLevelUserController,
};
