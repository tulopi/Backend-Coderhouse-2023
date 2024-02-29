import { Router } from "express";
import { notFound } from "../utils/notFound.js";

const notFoundRouter = Router();

notFoundRouter.use("*", notFound);

export default notFoundRouter;