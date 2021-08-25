import { Document } from "mongoose";
import { Element } from "./element";

export interface Pokemon extends Document {
  _id: string;
  name: string;
  height: number;
  weight: number;
  elements: string[];
  isCatched: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
