import axios from "axios";
import {Request, Response} from "express";
import z from "zod";
import {validateWithZod} from "~/utils/errorHandling";
import crypto from "crypto";
import Shop from "~/models/shop";

export const authorizeStore = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const state = crypto.randomBytes(16).toString("hex");

   res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 5 * 60 * 1000,
  });

  res.redirect(
    `https://${req.query.shop}/admin/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=read_orders,write_orders,read_products,write_products&redirect_uri=${process.env.APP_URL}/api/redirect&state=${state}`,
  );
};

// redirect endpoint
export const connectStore = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const stateFromQuery = req.query.state;
  const stateFromCookie = req.cookies?.oauth_state;
 
  if (!stateFromQuery || stateFromQuery !== stateFromCookie) {
    res.status(400).json({ error: "Invalid state" });
    return;
  }
 
  res.clearCookie("oauth_state");
 
  try {
    const { data } = await axios.post(
      `https://${req.query.shop}/admin/oauth/access_token`,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
        expiring: 0,
      },
    );
 
    const accessToken: string = data.access_token;
    const shop = req.query.shop as string;
 
    await Shop.findOneAndUpdate(
      { shopify_store_key: shop },
      { shopify_api_key: accessToken },
      { new: true },
    );
 
    const sessionRef = crypto.randomBytes(32).toString("hex");
 
    res.redirect(`${process.env.DOMAIN}/add-shop?shop=${shop}&ref=${sessionRef}`);
  } catch (error: unknown) {
    const responseData = axios.isAxiosError(error)
      ? error.response?.data
      : undefined;
 
    const responseText =
      typeof responseData === "string"
        ? responseData
        : JSON.stringify(responseData || {});
 
    const shopifyError = responseText.includes("Oauth error")
      ? "Shopify OAuth failed: invalid app credentials"
      : "Shop connection failed";
 
    console.error(
      "Connect store error:",
      axios.isAxiosError(error) ? error.response : error,
    );
 
    res.status(400).json({ error: shopifyError });
  }
};

export const verifyShop = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const verifySchema = z.object({
      shopify_store_key: z.string().trim().min(1),
      shopify_api_key: z.string().trim().min(1),
    });

    const {shopify_store_key, shopify_api_key} = await validateWithZod(
      verifySchema,
      req.body,
    );

    const query = `
      {
        shop {
          id
        }
      }
    `;

    const response = await axios.post(
      `https://${shopify_store_key}/admin/api/2023-07/graphql.json`,
      {query},
      {
        headers: {
          "X-Shopify-Access-Token": shopify_api_key,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.errors) {
      res.status(401).json({error: "Invalid credentials"});
      return;
    }

    res.json({
      success: true,
      shop: response.data.data.shop,
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as {status?: number}).status === 400
    ) {
      res.status(400).json({
        error: "Validation failed",
        details: (error as {validation?: Record<string, string>}).validation || {},
      });
      return;
    }

    console.error("Shop verify error:", axios.isAxiosError(error) ? error.response?.data || error.message : error);
    res.status(401).json({error: "Verification failed"});
  }
};