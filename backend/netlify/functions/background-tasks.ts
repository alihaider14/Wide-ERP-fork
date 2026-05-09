import { Config } from "@netlify/functions";
import { processSyncShopifyTask } from "../../src/services/background.service";
import { connectDB } from "../../src/utils/connectDb";

export default async () => {
  await connectDB();

  await processSyncShopifyTask();

  return new Response("Scheduled sync shopify products executed", {
    status: 200,
  });
};

export const config: Config = {
  schedule: "*/10 * * * *",
};
