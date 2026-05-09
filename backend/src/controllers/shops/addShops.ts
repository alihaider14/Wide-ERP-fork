import {Request, Response} from "express";
import {validateWithZod} from "~/utils/errorHandling";
import {addShopSchema} from "~/validations/shop.schema";
import {ERROR_MESSAGES} from "~/constants/errorMessages";
import {encryptApiKey} from "~/utils/encryption";
import Shop from "~/models/shop";

export const addShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = await validateWithZod(addShopSchema, req.body);
    const {name, phone, shopify_store_key} = validatedData;

    const existingShop = await Shop.findOne({
      $or: [{name}, {phone}, {shopify_store_key}],
    });

    if (existingShop) {
      res.status(400).json({error: ERROR_MESSAGES.shopExists});
      return;
    }

    const shopData = {
      ...validatedData,
      shopify_api_key: validatedData.shopify_api_key
        ? encryptApiKey(validatedData.shopify_api_key)
        : validatedData.shopify_api_key,
      meta_api_key: validatedData.meta_api_key
        ? encryptApiKey(validatedData.meta_api_key)
        : validatedData.meta_api_key,
    };

    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();

    const {shopify_api_key, meta_api_key, ...shopObj} = savedShop.toObject();
    res.status(201).json({
      message: "Shop added successfully",
      shop: shopObj,
    });
  } catch (error) {
    res.status(400).json({error});
  }
};
