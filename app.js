const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

let appInsights = require("applicationinsights");
appInsights
  .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, false)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(false)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
  .start();

appInsights.defaultClient.commonProperties = {
  environment: process.env.NODE_ENV,
};

const morgan = require("morgan");
const mongoose = require("mongoose");
const logger = require("./logger");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("mongodb connected");
  })
  .catch((err) => {
    logger.error("Test using third-party loggers Winston", err);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/appInsights", (req, res) => {
  logger.info(`sample info logger  ${req.url}`);
  res.json({ message: "Hello World!" });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  logger.error("error", error);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`server is running in port ${port}`);
});
