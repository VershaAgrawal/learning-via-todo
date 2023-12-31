const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "secretkey";

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  //Authorization: 'Bearer TOKEN'
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Error!Token was not provided." });
  }
  token = token.split(" ")[1];
  //Decoding the token
  try {
    const decodedToken = await jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, error: "Error in verifying the token" });
  }
};

const signUp = async (inputs) => {
  console.log("Insering new user...");
  try {
    const { emailId, password } = inputs;

    const user = new User({ emailId, password });
    if (emailId == "" || typeof emailId != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid Username" },
      };
    if (password == "" || typeof password != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid password" },
      };
    await user.save();
    return {
      statusCode: 200,
      body: { user: user.toObject({ versionKey: false }) },
    };
  } catch (err) {
    console.log(err.code);

    if (err.code == 11000) body = { error: "User already exists" };
    else body = { error: "Error while signing up :" + err.message };

    return {
      statusCode: 400,
      body: body,
    };
  }
};

const login = async (inputs) => {
  console.log("Logging in...");
  try {
    const { emailId, password } = inputs;
    if (emailId == "" || typeof emailId != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid Username" },
      };
    if (password == "" || typeof password != "string")
      return {
        statusCode: 400,
        body: { error: "Invalid password" },
      };
    const userDetail = await User.findOne({ emailId: emailId }, { __v: 0 });
    if (userDetail == null)
      return {
        statusCode: 400,
        body: { error: "User not found" },
      };
    if (userDetail.password != password)
      return {
        statusCode: 400,
        body: { error: "Incorrect password" },
      };

    //generate jwt token
    const token = await jwt.sign(
      { _id: userDetail._id, emailId: userDetail.emailId },
      secretKey,
      { expiresIn: "3000s" }
    );

    return {
      statusCode: 200,
      body: {
        success: "User validated. Logged in",
        emailId: userDetail.emailId,
        token: token,
      },
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: { error: "Error while logging in: " + err.message },
    };
  }
};

//Update slack URL in users document
const updateSlackUrl = async (inputs) => {
  console.log("Updating slack url...");
  const { _id, slackUrl } = inputs;
  if (typeof slackUrl == "" || typeof slackUrl != "string") {
    return {
      statusCode: 400,
      body: { error: "Invalid URL" },
    };
  }
  const updateSlackUrl = await User.findByIdAndUpdate(_id, { slackUrl });
  const updatedUser = await User.findOne({ _id: _id }, { __v: 0 });
  return {
    statusCode: 200,
    body: { user: updatedUser },
  };
};

module.exports = { signUp, login, verifyToken, updateSlackUrl };
