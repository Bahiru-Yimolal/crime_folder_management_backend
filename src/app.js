const express = require("express");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const workRoutes = require("./routes/workRoutes");
const subcityRoutes = require("./routes/subcityRoutes");
const sectorRoutes = require("./routes/sectorRoutes");
const committeeRoutes = require("./routes/committeeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const listRoutes = require("./routes/listRoutes");
const planRoutes = require("./routes/planRoutes");
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
app.use("/api/subcities", subcityRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/committees", committeeRoutes);



app.use("/api/profile", profileRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/work", workRoutes);


app.use("/api/list", listRoutes);
app.use("/api/plan", planRoutes);


app.use(errorMiddleware);

module.exports = app;
