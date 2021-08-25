import { Element } from "@server/types/element";

export type Pokemons = Pokemon[];

export type Pokemon = {
  _id: string;
  name: string;
  elements: Element[];
  height: number;
  weight: number;
  image: string;
  isCatched: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
