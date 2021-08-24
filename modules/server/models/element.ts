import mongoose,{ model, Schema } from 'mongoose';
import { Element } from '@server/types/element';

const elementSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },

},{timestamps: true})

// const ElementModel = model<Element>('Element', elementSchema)

export default  mongoose.models['Element']||  model<Element>('Element', elementSchema)
