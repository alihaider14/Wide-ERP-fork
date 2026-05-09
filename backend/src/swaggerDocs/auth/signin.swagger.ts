export const signinSwaggerDocs = {
    "/api/sign-in": {
        post: {
            tags: ["User"],
            summary: "Sign in a user",
            description: "Sign in user with the provided details",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "johndoe@example.com",
                                },
                                password: {
                                    type: "string",
                                    example: "StrongPassword123",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login successful.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: {
                                        type: "string",
                                        example: "Login successful.",
                                    },
                                    user: {
                                        type: "object",
                                        properties: {
                                            _id: {
                                                type: "string",
                                                example:
                                                    "65a7eec3b45c11b5d9f6a3d2",
                                            },
                                            full_name: {
                                                type: "string",
                                                example: "John Doe",
                                            },
                                            email: {
                                                type: "string",
                                                example: "johndoe@example.com",
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
                                    token: {
                                        type: "string",
                                        example:
                                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    },
                                    refreshToken: {
                                        type: "string",
                                        example:
                                            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
