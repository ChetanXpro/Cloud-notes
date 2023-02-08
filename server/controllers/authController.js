import User from "../models/User.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const login = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All field are required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      id: foundUser.id,
      role: foundUser.roles,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  const newRefreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "24h" }
  );

  if (cookies?.jwt) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  }

  res.cookie("jwt", newRefreshToken, {
    path: "/",
    maxAge: 100000,
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({
    email: foundUser.email,
    name: foundUser.name,
    role: foundUser.roles,
    accessToken,
  });
});

// !Refresh
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
});

//Logout

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const refreshToken = cookies?.jwt;
  console.log(`Cookie logout ${refreshToken}`);

  if (!refreshToken) return res.sendStatus(204);

  const foundUser = await User.findOne({ refresh: refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  }

  foundUser.refresh = foundUser.refresh.filter((r) => r !== refreshToken);
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  res.status(204).json({ message: "Logout" });
});

export default {
  login,
  refresh,
  logout,
};
