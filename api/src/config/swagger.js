import swaggerJSDOC from "swagger-jsdoc";
import { __dirname } from "../utils/utils.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Coderhouse API",
            version: "1.0.0",
            description: "API documentation for Coderhouse Project"
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
};


export const swaggerSetup = swaggerJSDOC(swaggerOptions);