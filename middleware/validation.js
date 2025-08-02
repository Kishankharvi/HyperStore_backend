import Joi from "joi"

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      })
    }
    next()
  }
}

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[+]?[\d\s\-$$$$]+$/),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
  }),
})

export const validateRegister = validateRequest(registerSchema)
export const validateLogin = validateRequest(loginSchema)
export const validateUpdateProfile = validateRequest(updateProfileSchema)
