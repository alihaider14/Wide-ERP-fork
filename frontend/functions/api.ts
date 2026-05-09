import serverless from "serverless-http";
import app from "../../backend/src/server";
export const handler = serverless(app);
