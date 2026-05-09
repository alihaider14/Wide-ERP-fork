import { signinSwaggerDocs } from "./auth/signin.swagger";
import { signupSwaggerDocs } from "./auth/signup.swagger";
import { productsSwaggerDocs } from "./products/product.swagger";

export const swaggerPaths = {
    ...signupSwaggerDocs,
    ...signinSwaggerDocs,
    ...productsSwaggerDocs,
};

export const swaggerTags = [
    {
        name: "User",
        description: "Authentication-related APIs",
    },
    {
        name: "Products",
        description: "Product-related APIs",
    },
];
