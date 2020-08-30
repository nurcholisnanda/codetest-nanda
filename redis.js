// const RedisClient = require("redis").createClient;
// const RedisCon = RedisClient(19221, "redis-19221.c1.ap-southeast-1-1.ec2.cloud.redislabs.com");

const Redis = require('ioredis')

const redis = new Redis({
  port: 19221,
  host: "redis-19221.c1.ap-southeast-1-1.ec2.cloud.redislabs.com",
  password: '3kKhYrpc5ItTahFqAsvcJ2IhVrdDM08J'
})

/**
 * get redis cache
 * @param {string} redis_key
 */
function get(redis_key) {
    return new Promise((resolve) => {
      redis.get(redis_key, (err, reply) => {
        if (err) {
          console.err("Redis Con", err);
        } else {
          console.log("Success Redis Get", redis_key);
          resolve({ reply });
        }
      });
    });
  }
  
  /**
   * set redis cache
   * @param {string} redis_key
   * @param {string} redis_value
   */
  function set(redis_key, redis_value) {
    console.log("Success Redis Set", redis_key, redis_value);
    redis.set(redis_key, redis_value);
  }
  
  module.exports.get = get;
  module.exports.set = set;
  