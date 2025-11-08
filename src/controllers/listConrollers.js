const {
  createListService,
  getListService,
  deleteListItemService,
  updateListValueService,
} = require("../services/listService");



const createListController = async (req, res, next) => {
  try {
    const { type, columns } = req.body;

    // Remove duplicates from the array
    const uniqueColumns = [...new Set(columns)];

    const newList = await createListService({ type, columns: uniqueColumns });

    res.status(201).json({
      success: true,
      message: "List created successfully",
      data: newList,
    });
  } catch (error) {
    next(error);
  }
};


const getListController = async (req, res, next) => {
  try {
    const { type } = req.params;

    const columns = await getListService(type);

    res.status(200).json({
      success: true,
      data: columns,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListItemController = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { value } = req.body;

    const updatedList = await deleteListItemService(type, value);

    res.status(200).json({
      success: true,
      message: `"${value}" removed successfully from list "${type}"`,
      data: updatedList,
    });
  } catch (error) {
    next(error);
  }
};

  
const updateListController = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { oldValue, newValue } = req.body;

    if (!oldValue || !newValue) {
      return res.status(400).json({
        success: false,
        message: "Both oldValue and newValue are required",
      });
    }

    const updatedList = await updateListValueService(type, oldValue, newValue);

    res.status(200).json({
      success: true,
      message: `Value "${oldValue}" updated to "${newValue}" successfully in list "${type}"`,
      data: updatedList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListController,
  getListController,
  deleteListItemController,
  updateListController,
};
