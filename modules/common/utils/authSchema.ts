import Joi from "joi";

export const authUser = Joi.object({
  password: Joi.string().min(8).max(16).required(),
  username: Joi.string().min(4).max(16).required(),
  email: Joi.string().email().required(),
});
