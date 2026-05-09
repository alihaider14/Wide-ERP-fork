import {Request, Response} from "express";
import Courier from "~/models/courier";
import {courierSchema} from "~/validations/courier.schema";
import {validateWithZod} from "~/utils/errorHandling";
import {isValidObjectId} from "mongoose";
import {encryptApiKey} from "~/utils/encryption";
export const createCourier = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(courierSchema, req.body);
    const {name, address_code, shop, api_key, status, pickup_address, return_address} = validatedData;

    if (!isValidObjectId(shop)) {
      res.status(400).json({error: "Invalid shop."});
      return;
    }

    const courier = await Courier.create({
      name,
      address_code: name === "PostEx" ? address_code : "",
      shop,
      api_key: api_key ? encryptApiKey(api_key) : api_key,
      status,
      pickup_address,
      return_address,
    });

    res.status(201).json({
      _id: courier._id,
      name: courier.name,
      address_code: courier.address_code,
      shop: courier.shop,
      status: courier.status,
      pickup_address: courier.pickup_address,
      return_address: courier.return_address,
      updated_at: courier.updatedAt,
    });
  } catch (error) {
    res
      .status(400)
      .json({error: error instanceof Error ? error.message : error});
  }
};
