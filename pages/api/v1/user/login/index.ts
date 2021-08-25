import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@server/models/user";
import dbConnect from "@server/services/dbConnect";

declare var process: {
  env: {
    JWT_KEY: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  const JWT_KEY = process.env.JWT_KEY;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          res.status(400).json({
            status: "Failed",
            message: "Please fill the username and password field.",
          });
          return;
        }

        const user = await UserModel.findOne({ username }).select("+password");
        if (!user) {
          res.status(400).json({
            status: "Failed",
            message: "Invalid username or password.",
          });
          return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          res.status(400).json({
            status: "Failed",
            message: "Invalid username or password.",
          });
          return;
        }

        const token = jwt.sign(
          { username: user.username, _id: user._id },
          JWT_KEY,
          {
            expiresIn: "6h",
          }
        );

        res
          .status(200)
          .json({ email: user.email, username: user.username, token });
      } catch (error) {
        res.status(500).json({
          status: "Failed",
          message: "Internal server error",
          error,
        });
        console.log(error);
      }

      break;
    default:
      res
        .status(500)
        .json({ status: "Failed", message: "Internal Server Error" });
      break;
  }
}
