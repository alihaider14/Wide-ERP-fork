import { Request, Response } from "express";
import Vendor from "~/models/vendor";

export const getVendorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id).select("_id full_name email phone address to_pay opening_balance updatedAt createdAt");
    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }
    res.status(200).json({ vendor });
  } catch (error) {
    res.status(400).json({ error });
  }
};
