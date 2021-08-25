import PokemonModel from "@server/models/pokemon";
import type { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@server/services/dbConnect";
import ElementModel from "@server/models/element";
import UserModel from "@server/models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const pokemon = await PokemonModel.findById(id)
          .populate({
            path: "elements",
            model: ElementModel,
          })
          .populate({ path: "owner", model: UserModel });

        if (!pokemon) {
          res.status(400).json({
            status: "Failed",
            message: `Get pokemon with id:${id} failed, beacuse that id doesn't exist`,
            pokemon: {},
          });
          return;
        }

        res.status(201).json({
          status: "Success",
          message: `Get pokemon with id:${id} successfully`,
          pokemon,
        });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: "Failed", message: "Internal Server Error", error });
      }
      break;
    case "DELETE":
      try {
        const deletedPokemon = await PokemonModel.findByIdAndRemove(id);

        if (!deletedPokemon) {
          res.status(501).json({
            status: "Failed",
            message: `Delete pokemon by id:${id} failed, not implemented.`,
          });
          return;
        }
        const pokemons = await PokemonModel.find().populate({
          path: "elements",
          model: ElementModel,
        });

        res.status(201).json({
          status: "Success",
          message: `Delete pokemon by id:${id} successfully`,
          pokemons,
        });
      } catch (error) {
        res
          .status(500)
          .json({ status: "Failed", message: "Internal Server Error" });
      }
      break;
    case "PATCH":
      try {
        const { name, elements, isCatched, height, weight, image, owner } =
          req.body;

        if (
          !name ||
          !elements ||
          typeof isCatched !== "boolean" ||
          !height ||
          !weight ||
          !image ||
          typeof owner !== "string"
        ) {
          res.status(401).json({
            status: 401,
            error: `ValidationError: Pokemon validation failed: name: ${name}, elements: ${elements}, isCatched: ${isCatched}, height: ${height}, weight: ${weight}, image: ${image}`,
          });

          return;
        }

        const updatedPokemon = await PokemonModel.findByIdAndUpdate(id, {
          name,
          elements,
          isCatched,
          height,
          weight,
          image,
          owner,
        });

        if (!updatedPokemon) {
          res.status(501).json({
            status: "Failed",
            message: `Updated pokemon by id:${id} failed, not implemented.`,
          });
          return;
        }
        const pokemons = await PokemonModel.find().populate({
          path: "elements",
          model: ElementModel,
        });

        res.status(201).json({
          status: "Success",
          message: `Updated pokemon by id:${id} successfully`,
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
}
