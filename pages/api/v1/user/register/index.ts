import { authUser } from "@common/utils/authSchema";
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
        const userValidate = await authUser.validateAsync(req.body);
        const { password, username, email } = req.body;

        const isUserExist = await UserModel.findOne({
          $or: [{ email }, { username }],
        });
        if (isUserExist) {
          res.status(501).json({
            status: "Failed",
            message:
              "Email or username already registered, register not implemented!",
          });

          return;
        }

        const hashStrenght = 10;
        const hashedPassword = await bcrypt.hash(password, hashStrenght);

        const newUserModel = new UserModel({
          username,
          email,
          password: hashedPassword,
        });
        const newUser = await newUserModel.save();

        const token = jwt.sign({ username, _id: newUser._id }, JWT_KEY, {
          expiresIn: "6h",
        });

        res.status(200).json({ email, username, token });
      } catch (error) {
        if (error.isJoi === true) {
          res.status(422).json({ error: error.details[0].message });
        } else {
          res.status(500).json({
            status: "Failed",
            message: "Internal server error",
            error,
          });
          console.log(error);
        }
      }

      break;
    default:
      res
        .status(500)
        .json({ status: "Failed", message: "Internal Server Error" });
      break;
  }
}
