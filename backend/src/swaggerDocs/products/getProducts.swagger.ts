export const getProductsSwaggerDocs = {
    get: {
        tags: ["Products"],
        summary: "Get all products",
        security: [
            {
                BearerAuth: [],
            },
        ],
        parameters: [
            {
                in: "query",
                name: "pageNo",
                description: "Page number",
                required: true,
                schema: {
                    type: "number",
                    example: 1,
                },
            },
            {
                in: "query",
                name: "size",
                description: "Number of products per page",
                required: true,
                schema: {
                    type: "number",
                    example: 10,
                },
            },
        ],
        responses: {
            200: {
                description: "List of products",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                totalPages: { type: "number", example: 1 },
                                totalRows: { type: "number", example: 1 },
                                from: { type: "number", example: 1 },
                                to: { type: "number", example: 1 },
                                products: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            _id: {
                                                type: "string",
                                                example:
                                                    "60f3b3b3b3b3b3b3b3b3b3b3",
                                            },
                                            name: {
                                                type: "string",
                                                example: "Product name",
                                            },
                                            barcode: {
                                                type: "string",
                                                example:
                                                    "Product barcode string",
                                            },
                                            sku: {
                                                type: "string",
                                                example: "Product sku",
                                            },
                                            original_price: {
                                                type: "number",
                                                example: 1000,
                                            },
                                            sale_price: {
                                                type: "number",
                                                example: 900,
                                            },
                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                                example: "2024-02-27T12:34:56Z",
                                            },
                                            updatedAt: {
                                                type: "string",
                                                format: "date-time",
                                                example: "2024-02-27T12:34:56Z",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
