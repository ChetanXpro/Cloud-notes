import redis from "async-redis";
import logger from "./logger.js";

var cacheHostName = process.env.REDIS_CACHE;
var cachePassword = process.env.REDIS_PASSWORD;
const redisClient = redis.createClient({
  url: "rediss://" + cacheHostName + ":6380",
  password: cachePassword,
});

redisClient.on("connect", () => logger.info("Redis connected"));

export const deleteKey = async (key) => {
  return await redisClient.del(key);
};
export const getKey = async (key) => {
  return await redisClient.get(key);
};
export const setKey = async (key, value, expire = 0, setIfNotExist = false) => {
  let params = [key, value];
  if (expire > 0) params.push("EX", expire);
  if (setIfNotExist) params.push("NX");

  let response = await redisClient.sendCommand("SET", params);

  if (response) {
    return true;
  } else return false;
};
