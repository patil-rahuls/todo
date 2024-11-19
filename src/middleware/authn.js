import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const authnMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req?.headers);
    const token = req?.headers?.authorization;
    if(!token){
      throw new Error(`Invalid Request. No token found in the header.`);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    res.locals.userId = decoded.id;
    next();
  } catch(err){
    throw new Error(`Unauthorised! Token expired. Please login again.`);
  }
});

export { authnMiddleware };