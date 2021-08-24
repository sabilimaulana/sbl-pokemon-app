import { Pokemon } from '@server/types/pokemon';
import mongoose,{ model, Schema } from 'mongoose';
import ElementModel from './element';

const pokemonSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  elements: [
    { type: 'ObjectId', ref: ElementModel.modelName }
  ],
  isCatched: {
    type: Boolean,
    required: true
  },
},{timestamps: true})

// const PokemonModel =  model<Pokemon>('Pokemon', pokemonSchema)

export default mongoose.models['Pokemon'] || model<Pokemon>('Pokemon', pokemonSchema)


