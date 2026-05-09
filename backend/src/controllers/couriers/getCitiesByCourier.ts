import { Request, Response } from "express";
import { fetchCourierCities } from "../../services/courier-cities.service";
import Courier from "~/models/courier";

export const getCitiesByCourier = async (req: Request, res: Response) => {
  try {
    const courier_id = req.query.courier_id;

    if (!courier_id) {
      return res.status(400).json({ message: "courier_id is required." });
    }

    const courier = await Courier.findById(courier_id);
    if (!courier) {
      return res.status(404).json({ message: "Courier not found." });
    }

    const cities = await fetchCourierCities(courier?.name);

    return res.status(200).json({ cities });
  } catch (error) {
    console.error("getCitiesByCourier error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};