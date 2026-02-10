const express = require("express");
const userRoutes = require("./routes/userRoutes");
const subcityRoutes = require("./routes/subcityRoutes");
const sectorRoutes = require("./routes/sectorRoutes");
const cityRoutes = require("./routes/cityRoutes");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/subcities", subcityRoutes);
app.use("/api/sectors", sectorRoutes);
// app.use("/api/committees", committeeRoutes);

app.use(errorMiddleware);

module.exports = app;
