import joi from "joi";

const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    profilePicture: joi.string().uri().optional(),
    coverPicture: joi.string().uri().optional(),
    isAdmin: joi.boolean().optional(),
    followers: joi.array().items(joi.string()).optional(),
    following: joi.array().items(joi.string()).optional(),
    stories: joi.array().items(joi.string()).optional(),
  });

  return schema.validate(data);
};

export default userValidation;
