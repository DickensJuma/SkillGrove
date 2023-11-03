const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function authenticateUser(email, password) {
  let user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  bcrypt.compare(password, user.password, (compareError, isMatch) => {
    if (compareError) {
      return null;
    }

    if (!isMatch) {
      return null;
    }
  });

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

function verifyUser(req, res, next) {
  const user = authenticateUser(req.body.email, req.body.password);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
}

async function requireAuthentication(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  const { userId } = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        console.log("err", err);
        return null;
      }
      return decoded;
    }
  );

  const currentUser = await User.findById(userId);
  console.log("currentUser", currentUser);

  if (currentUser) {
    req.user = currentUser;
    next();
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
}

module.exports = {
  verifyUser,
  requireAuthentication,
};
