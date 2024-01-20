// redis.js

const redis = require("redis");
const util = require("util");

const redisConfig = {
  host: "redis-12d75cbc-virenderkumar23435-ed80.a.aivencloud.com",
  port: 20966,
  password: "AVNS_XNQN_xMIQWnTtp-hHpF",
  username: "default",
};

const redisClient = redis.createClient(redisConfig);

// Promisify Redis client methods
redisClient.getAsync = util.promisify(redisClient.get).bind(redisClient);
redisClient.lrangeAsync = util.promisify(redisClient.lrange).bind(redisClient);
redisClient.lpushAsync = util.promisify(redisClient.lpush).bind(redisClient);
redisClient.expireAsync = util.promisify(redisClient.expire).bind(redisClient);

module.exports = redisClient;
