import { Document } from "mongoose";

export interface Pokemon extends Document {
  _id: string;
  name: string;
  height: number;
  weight: number;
  image: string;
  owner: string;
  elements: string[];
  isCatched: boolean;
  isExchange: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
