const List = require("../models/listModel");
const { AppError } = require("../middlewares/errorMiddleware");


const createListService = async ({ type, columns }) => {
  const existingList = await List.findOne({ where: { type } });

  const uniqueNewValues = [...new Set(columns.map((item) => item.trim()))];

  if (!existingList) {
    // Create new list if not exists
    const newList = await List.create({
      type,
      columns: uniqueNewValues,
    });
    return newList;
  }

  // Merge with existing list (no duplicates)
  const existingColumns = existingList.columns || [];
  const mergedColumns = [...new Set([...existingColumns, ...uniqueNewValues])];

  existingList.columns = mergedColumns;
  await existingList.save();

  return existingList;
};

const getListService = async (type) => {
  const list = await List.findOne({ where: { type } });

  if (!list) {
    throw new AppError("List not found for the specified type", 404);
  }

  return list.columns;
};

const deleteListItemService = async (type, value) => {
  const list = await List.findOne({ where: { type } });

  if (!list) {
    throw new AppError(`List with type "${type}" not found`, 404);
  }

  if (!list.columns.includes(value)) {
    throw new AppError(
      `Value "${value}" does not exist in list "${type}"`,
      400
    );
  }

  const updatedColumns = list.columns.filter((item) => item !== value);

  list.columns = updatedColumns;
  await list.save();

  return list;
};

const updateListValueService = async (type, oldValue, newValue) => {
  const list = await List.findOne({ where: { type } });

  if (!list) {
    throw new AppError(`List with type "${type}" not found`, 404);
  }

  const columns = list.columns;

  if (!columns.includes(oldValue)) {
    throw new AppError(
      `Value "${oldValue}" does not exist in list "${type}"`,
      400
    );
  }

  if (columns.includes(newValue)) {
    throw new AppError(
      `Value "${newValue}" already exists in list "${type}"`,
      400
    );
  }

  // Replace oldValue with newValue
  const updatedColumns = columns.map((item) =>
    item === oldValue ? newValue : item
  );

  list.columns = updatedColumns;
  await list.save();

  return list;
};


module.exports = {
  createListService,
  getListService,
  deleteListItemService,
  updateListValueService,
};
