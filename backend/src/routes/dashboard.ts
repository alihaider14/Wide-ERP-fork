import express from "express";
import {
	getDashboardAnalytics,
	getOrdersOverTime,
	getSalesOverTime,
	getTopSellingProducts,
} from "~/controllers/dashboard/getDashboardAnalytics";

export default (router: express.Router) => {
	router.get("/analytics-over-time", getDashboardAnalytics);
	router.get("/orders-over-time", (req, res) => {
		void getOrdersOverTime(req, res);
	});
	router.get("/sales-over-time", getSalesOverTime);
	router.get("/top-selling-products", getTopSellingProducts);
};
