import jwt, { JwtPayload } from "jsonwebtoken";
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
    case "GET":
      try {
        // Untuk memisahkan 'Bearer' dan 'token'
        const token = req?.headers?.authorization?.split(" ")[1] || "";
        if (!token) {
          res.status(401).json({ message: "Auth failed" });
          return;
        }

        const decoded: JwtPayload | string = jwt.verify(token, JWT_KEY);

        if (typeof decoded === "object") {
          const user = await UserModel.findById(decoded._id);

          res.status(200).json({ user });
        }
      } catch (error) {
        if (error.name === "JsonWebTokenError") {
          res.status(401).json({ message: "Auth failed" });
          return;
        }
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
