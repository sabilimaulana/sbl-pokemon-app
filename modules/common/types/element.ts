import { Document } from "mongoose";

export interface Element extends Document {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ElementBody {
  name: string;
}
