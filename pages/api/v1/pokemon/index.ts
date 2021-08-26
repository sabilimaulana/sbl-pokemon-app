import PokemonModel from "@server/models/pokemon";
import { Pokemon } from "@server/types/pokemon";
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@server/services/dbConnect";
import ElementModel from "@server/models/element";
import UserModel from "@server/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const pokemons = await PokemonModel.find({}).populate({
          path: "elements",
          model: ElementModel,
        });
        res.status(201).json({
          status: "Success",
          message: "Get all pokemon successfully",
          pokemons,
        });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "Failed", message: "Internal Server Error", error });
      }
      break;
    case "POST":
      try {
        const {
          name,
          elements,
          isCatched,
          height,
          weight,
          image,
          owner,
          isExchange,
          wantedPokemonId,
          wantedPokemonName,
        } = req.body;

        if (
          !name ||
          !elements ||
          typeof isCatched !== "boolean" ||
          typeof isExchange !== "boolean" ||
          typeof wantedPokemonId !== "string" ||
          typeof wantedPokemonName !== "string" ||
          !height ||
          !weight ||
          !image ||
          !owner
        ) {
          res.status(401).json({
            status: 401,
            error: `ValidationError: Pokemon validation failed: name: ${name}, elements: ${elements}, isCatched: ${isCatched}, height: ${height}, weight: ${weight}, image: ${image}`,
          });

          return;
        }

        const newPokemonModel: Pokemon = new PokemonModel({
          name,
          elements,
          isCatched,
          isExchange,
          height,
          weight,
          image,
          owner,
          wantedPokemonId,
          wantedPokemonName,
        });

        const newPokemon = await newPokemonModel.save();
        const pokemons = await PokemonModel.find()
          .populate({
            path: "elements",
            model: ElementModel,
          })
          .populate({ path: "owner", model: UserModel });

        res.status(201).json({
          status: "Success",
          message: "Add new pokemon successfully",
          pokemons,
        });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "Failed", message: "Internal Server Error" });
      }
      break;
    default:
      res
        .status(500)
        .json({ status: "Failed", message: "Internal Server Error" });
      break;
  }
}
