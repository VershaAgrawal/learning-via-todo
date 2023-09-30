import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import RedisClient from "ioredis";

// Create a `ioredis` client
const client = new RedisClient({
  //     port: 6379, // Redis port
  //   host: "127.0.0.1", // Redis host
  //   username: "default", // needs Redis >= 6
  //   password: "my-top-secret",
  //   db: 0, // Defaults to 0
});

export const loginRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args) => client.call(...args),
  }),
});

export const todosRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args) => client.call(...args),
  }),
});
