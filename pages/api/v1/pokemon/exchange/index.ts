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
    case "POST":
      try {
        const { firstPokemon, secondPokemon } = req.body;

        if (!firstPokemon || !secondPokemon) {
          res.status(401).json({
            status: 401,
            error: `ValidationError: Pokemon validation failed: firstPokemon: ${firstPokemon}, secondPokemon: ${secondPokemon},`,
          });

          return;
        }

        const firstPokemonData = await PokemonModel.findById(firstPokemon);
        const secondPokemonData = await PokemonModel.findById(secondPokemon);

        console.log(firstPokemonData);
        console.log(secondPokemonData);

        const updateFirstPokemon = await PokemonModel.findByIdAndUpdate(
          firstPokemon,
          {
            name: firstPokemonData.name,
            elements: firstPokemonData.elements,
            isCatched: firstPokemonData.isCatched,
            isExchange: firstPokemonData.isExchange,
            height: firstPokemonData.height,
            weight: firstPokemonData.weight,
            image: firstPokemonData.image,
            owner: secondPokemonData.owner,
          },
          {
            new: true,
          }
        );

        const updateSecondPokemon = await PokemonModel.findByIdAndUpdate(
          secondPokemon,
          {
            name: secondPokemonData.name,
            elements: secondPokemonData.elements,
            isCatched: secondPokemonData.isCatched,
            isExchange: secondPokemonData.isExchange,
            height: secondPokemonData.height,
            weight: secondPokemonData.weight,
            image: secondPokemonData.image,
            owner: firstPokemonData.owner,
          },
          {
            new: true,
          }
        );
        res.status(200).json({
          status: "Success",
          message: "Exchange pokemon success",
          firstPokemon: updateFirstPokemon,
          secondPokemon: updateSecondPokemon,
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
}
