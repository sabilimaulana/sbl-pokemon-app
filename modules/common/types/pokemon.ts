import { Element } from "@server/types/element";
import { User } from "@common/types/user";

export type Pokemons = Pokemon[];

export type Pokemon = {
  _id: string;
  name: string;
  elements: Element[];
  height: number;
  weight: number;
  owner: User;
  image: string;
  isCatched: boolean;
  isExchange: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
