import PokemonModel from "@server/models/pokemon";
import { Pokemon } from "@server/types/pokemon";
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@server/services/dbConnect";
import ElementModel from "@server/models/element";

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
        const { name, elements, isCatched, height, weight } = req.body;

        if (
          !name ||
          !elements ||
          typeof isCatched !== "boolean" ||
          !height ||
          !weight
        ) {
          res.status(401).json({
            status: 401,
            error: `ValidationError: Pokemon validation failed: name: ${name}, elements: ${elements}, isCatched: ${isCatched}, height: ${height}, weight: ${weight}`,
          });

          return;
        }

        const newPokemonModel: Pokemon = new PokemonModel({
          name,
          elements,
          isCatched,
          height,
          weight,
        });

        const newPokemon = await newPokemonModel.save();
        const pokemons = await PokemonModel.find().populate({
          path: "elements",
          model: ElementModel,
        });

        res.status(201).json({
          status: "Success",
          message: "Add new pokemon successfully",
          pokemons,
        });
      } catch (error) {
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

  res.status(200);
}
