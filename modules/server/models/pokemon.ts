import { Pokemon } from "@server/types/pokemon";
import mongoose, { model, Schema } from "mongoose";
import ElementModel from "./element";
import UserModel from "./user";

const pokemonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: "ObjectId",
      ref: UserModel.modelName,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    elements: [{ type: "ObjectId", ref: ElementModel.modelName }],
    isCatched: {
      type: Boolean,
      required: true,
    },
    isExchange: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

// const PokemonModel =  model<Pokemon>('Pokemon', pokemonSchema)

export default mongoose.models["Pokemon"] ||
  model<Pokemon>("Pokemon", pokemonSchema);
