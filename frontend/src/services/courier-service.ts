import { axiosInstance } from "./axios-cofig";
import { CityOption, TCourier } from "@/types/Courier";

export const getCouriersByShop = async (shopId: string) => {
	const response = await axiosInstance.get("/couriers-by-shop", {
		params: { shop_id: shopId },
	});
	return response.data.data;
};

export const deleteCourier = async (id: string) => {
	const response = await axiosInstance.delete("/courier", {
		data: { _id: id },
	});
	return response.data;
};

export const addCourier = async (data: Partial<TCourier>) => {
	const response = await axiosInstance.post("/courier", data);
	return response.data;
};

export const getCouriers = async (pageNo = 1, pageSize = 10, search = "") => {
	let url = `/couriers?pageNo=${pageNo}&size=${pageSize}`;
	if (search) url += `&q=${search}`;
	const response = await axiosInstance.get(url);
	return response.data;
};

export const getCourierById = async (id: string) => {
	const response = await axiosInstance.get(`/courier/${id}`);
	return response.data;
};

export const updateCourier = async (data: TCourier & { _id: string }) => {
	const response = await axiosInstance.put("/courier", data);
	return response.data;
};

export const getCourierCities = async (
  courierId: string
): Promise<CityOption[]> => {
  const { data } = await axiosInstance.get("/cities", {
    params: { courier_id: courierId }, 
  });
  return data.cities;
};
