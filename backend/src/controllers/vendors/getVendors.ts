import { Request, Response } from "express";
import { validateWithZod } from "~/utils/errorHandling";
import { getVendorsSchema } from "~/validations/vendor.schema";
import Vendor from "~/models/vendor";

export const getVendors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = await validateWithZod(getVendorsSchema, req.query);

    const page = req.query.pageNo ? Number(req.query.pageNo) : validatedData.page;
    const size = validatedData.size;
    const q = validatedData.q;

    const filter: {
      $or?: Array<
        | { full_name: { $regex: string; $options: string } }
        | { name: { $regex: string; $options: string } }
        | { email: { $regex: string; $options: string } }
        | { phone: { $regex: string; $options: string } }
      >;
    } = {};

    if (q) {
      filter.$or = [
        { full_name: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    const totalCount = await Vendor.countDocuments(filter);

    const queryOptions = {
      skip: size * (page - 1),
      limit: size,
    };

    const totalPages = Math.ceil(totalCount / size);
    const to = size * page;
    const from = to - (size - 1);

    const vendors = await Vendor.find(filter, {}, queryOptions)
      .sort({ updatedAt: -1 })
      .select("_id full_name name email phone address to_pay updatedAt");

    const formattedVendors = vendors.map((vendor) => ({
      _id: vendor._id,
      full_name: vendor.full_name,
      email: vendor.email || "",
      phone: vendor.phone,
      address: vendor.address || "",
      to_pay: vendor.to_pay,
      updatedAt: vendor.updatedAt.toISOString(),
    }));

    res.status(200).json({
      total_pages: totalPages,
      total_rows: totalCount,
      from,
      to: to > totalCount ? totalCount : to,
      vendors: formattedVendors,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
