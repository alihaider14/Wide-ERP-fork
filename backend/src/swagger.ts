import swaggerJsdoc from "swagger-jsdoc";
import { swaggerPaths, swaggerTags } from "./swaggerDocs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WD Barcode Generator",
            version: "1.0.0",
            description:
                "This is a Node.js application built using Express, TypeScript, MongoDB, and Mongoose.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
            {
                url: "https://wd-barcode-generator.vercel.app",
                description: "Production server",
            },
        ],
        tags: swaggerTags,
        paths: swaggerPaths,
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [],
};

export default swaggerJsdoc(options);
