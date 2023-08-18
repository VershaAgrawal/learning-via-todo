const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const todosRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

module.exports = { loginRateLimiter, todosRateLimiter };
