import {Request, Response} from "express";
import Courier from "~/models/courier";
import {isValidObjectId} from "mongoose";
import {updateCourierSchema} from "~/validations/courier.schema";
import {validateWithZod} from "~/utils/errorHandling";
import {encryptApiKey} from "~/utils/encryption";
import type { TPopulatedShop } from "~/types/courier";

export const updateCourier = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {name, address_code, shop, api_key, status, pickup_address, return_address} = await validateWithZod(
      updateCourierSchema,
      req.body,
    );

    const {_id} = req.body;

    const courier = await Courier.findById(_id).populate("shop", "name");

    if (!courier) {
      res.status(404).json({error: "Courier not found"});
      return;
    }

    if (!isValidObjectId(shop)) {
      res.status(400).json({error: "Invalid shop."});
      return;
    }

    const updates = {
      name: courier.name,
      address_code: courier.address_code,
      shop: courier.shop,
      api_key: courier.api_key,
      status: courier.status,
      pickup_address: courier.pickup_address,
      return_address: courier.return_address,
    };

    if (name) updates["name"] = name;
	
    if (name === "PostEx") {
      updates["address_code"] = address_code;
    }

    if (name && name !== "PostEx") {
      updates.address_code = "";
    }

    if (shop) updates["shop"] = shop;
    if (api_key) {
      updates["api_key"] = encryptApiKey(api_key);
    }
    if (status) updates["status"] = status;
    if (pickup_address) updates["pickup_address"] = pickup_address;
    if (return_address) updates["return_address"] = return_address;

    const updatedCourier = await Courier.findByIdAndUpdate(_id, updates, {
      new: true,
    }).populate("shop", "name");

    const populatedShop = updatedCourier?.shop as unknown as TPopulatedShop | undefined;

    res.status(200).json({
      _id: updatedCourier?._id,
      name: updatedCourier?.name,
      address_code: updatedCourier?.address_code,
      status: updatedCourier?.status,
      pickup_address: updatedCourier?.pickup_address,
      return_address: updatedCourier?.return_address,
      updated_at: updatedCourier?.updatedAt,
      shop: populatedShop?.name ?? "",
      shop_id: populatedShop?._id ?? updatedCourier?.shop,
    });
  } catch (error) {
    res
      .status(400)
      .json({error: error instanceof Error ? error.message : error});
  }
};
