const express = require("express");
const {
  createListController,
  getListController,
  deleteListItemController,
  updateListController,
} = require("../controllers/listConrollers");

const {
  validateList,
} = require("../validators/profileValidators");

const {
  protect,
} = require("../middlewares/authMiddleware");



const router = express.Router();

router.route("/:type").get(protect, getListController);

 router.route("/").post(protect, validateList, createListController);

 router.route("/:type").delete(protect, deleteListItemController);

 router.route("/:type").put(protect, updateListController);

module.exports = router;
