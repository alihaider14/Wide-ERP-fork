export const updateProductSwaggerDocs = {
    put: {
        tags: ["Products"],
        summary: "Update a product",
        description: "Update a product with the provided details",
        security: [
            {
                BearerAuth: [],
            },
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            productId: {
                                type: "string",
                                example: "67c1e076445c13912b8a6bf2",
                            },
                            name: {
                                type: "string",
                                example: "Test Product",
                            },
                            barcode: {
                                type: "string",
                                example: "Test Product",
                            },
                            sku: {
                                type: "string",
                                example: "test-product",
                            },
                            original_price: {
                                type: "number",
                                example: 100,
                            },
                            sale_price: {
                                type: "number",
                                example: 90,
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Product updated successfully",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                success: { type: "boolean", example: true },
                                message: {
                                    type: "string",
                                    example: "Product updated successfully",
                                },
                                product: {
                                    type: "object",
                                    properties: {
                                        _id: {
                                            type: "string",
                                            example: "65a7eec3b45c11b5d9f6a3d2",
                                        },
                                        name: {
                                            type: "string",
                                            example: "John Doe",
                                        },
                                        barcode: {
                                            type: "string",
                                            example: "johndoe@example.com",
                                        },
                                        sku: {
                                            type: "string",
                                            example: "johndoe@example.com",
                                        },
                                        original_price: {
                                            type: "number",
                                            example: 100,
                                        },
                                        sale_price: {
                                            type: "number",
                                            example: 90,
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
};
