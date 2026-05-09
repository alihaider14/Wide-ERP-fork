import axios from "axios";

export interface CityOption {
  id: string;
  name: string;
}

export const fetchCourierCities = async (
  courierName: string,
): Promise<CityOption[]> => {
  switch (courierName) {
    case "PostEx":
      return fetchPostExCities();
    case "Insta":
      return fetchInstaCities();
    case "Rocket":
      return fetchRocketCities();
    default:
      throw new Error(`Unsupported courier: ${courierName}`);
  }
};

const fetchPostExCities = async (): Promise<CityOption[]> => {
  const { data } = await axios.get(
    "https://api.postex.pk/services/integration/api/order/v2/get-operational-city",
    { headers: { token: process.env.POSTEX_TOKEN! } }
  );

  return (data?.dist  ?? []).map((c: { operationalCityName: string }) => ({
    id: c.operationalCityName.toUpperCase(),
    name: c.operationalCityName.toUpperCase(),
  }));
};

const fetchInstaCities = async (): Promise<CityOption[]> => {
  const { data } = await axios.get(
    "https://one-be.instaworld.pk/logistics/cities",
    { headers: { Authorization: `Bearer ${process.env.INSTA_API_KEY!}` } }
  );

   return (data ?? []).map((c: { id: number; name: string }) => ({
    id: c.name.toUpperCase(),
    name: c.name.toUpperCase(),
  }));
};

const fetchRocketCities = async (): Promise<CityOption[]> => {
  const params = new URLSearchParams();
  params.append("api_key", process.env.ROCKET_API_KEY!);
  params.append("country", "PK"); 

  const { data } = await axios.get(
    "https://app.couriermanager.eu/cscourier/API/list_cities",
    {
      params,  
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return (Array.isArray(data) ? data : []).map((c: { name: string }) => ({
    id: c.name.toUpperCase(),
    name: c.name.toUpperCase(),
  }));
};