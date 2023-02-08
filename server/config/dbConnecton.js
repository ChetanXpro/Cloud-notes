import { set, connect } from "mongoose";
import logger from "./logger.js";
// import { info, error as _error } from "./logger";

// const logger = require("./logger");


const connectDB = async () => {
  try {
    set('strictQuery', false)
    await connect(process.env.DATABASE_URI, () => {
      logger.info("Database connected");
    });
  } catch (error) {
    logger.error(error);
  }
};

export default connectDB;
