import { addProductSwaggerDocs } from "./addProduct.swagger";
import { getProductsSwaggerDocs } from "./getProducts.swagger";
import { updateProductSwaggerDocs } from "./updateProduct.swagger";

export const productsSwaggerDocs = {
    "/api/products": {
        ...getProductsSwaggerDocs,
        ...addProductSwaggerDocs,
        ...updateProductSwaggerDocs,
    },
};
