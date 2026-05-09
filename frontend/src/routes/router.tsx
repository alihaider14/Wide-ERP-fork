import { createBrowserRouter, Navigate } from "react-router-dom";
import {
	AddAdjustQuantity,
	AddOrder,
	AddProduct,
	AddUser,
	AdjustQuantities,
	Login,
	OrderCompleted,
	Orders,
	PrintBarCode,
	Products,
	UpdateAdjustQuantity,
	UpdateOrder,
	UpdateProduct,
	UpdateUser,
	Users,
	Dashboard,
	ForgotPassword,
	ResetPassword,
	Shops,
	AddShop,
	UpdateShop,
	Shopify,
	Activities,
	Vendors,
	AddVendor,
	UpdateVendor,
	Couriers,
	AddCourier,
	UpdateCourier,
	StockZone,
	AddStockZone,
	UpdateStockZone,
	Bills,
	Analytics,
	AddBill,
	UpdateBill,
	Payments,
	AddPayment,
	UpdatePayment,
	BackgroundTasks,
	Employees,
	AddEmployee,
	UpdateEmployee,
	ViewEmployee,
	Attendance,
	MarkAttendance,
	BookAtCourier,
	UpdateShopifyOrder,
	MergeShopifyOrders,
} from "@/views";
import ProtectedRoutes from "./ProtectedRoutes";

export const router = createBrowserRouter([
	{
		path: "/Login",
		element: <Login />,
	},
	{
		path: "/forgot-password",
		element: <ForgotPassword />,
	},
	{
		path: "/reset-password",
		element: <ResetPassword />,
	},
	{
		element: <ProtectedRoutes />,
		children: [
			{
				path: "/dashboard",
				element: <Dashboard />,
			},
			{
				path: "/analytics",
				element: <Analytics />,
			},
			{
				path: "/products",
				element: <Products />,
			},
			{
				path: "/add-product",
				element: <AddProduct />,
			},
			{
				path: "/update-product/:id",
				element: <UpdateProduct />,
			},
			{
				path: "/print-barcode",
				element: <PrintBarCode />,
			},
			{
				path: "/adjust-quantities/:id",
				element: <AdjustQuantities />,
			},
			{
				path: "/add-quantity",
				element: <AddAdjustQuantity />,
			},
			{
				path: "/update-quantity/:id",
				element: <UpdateAdjustQuantity />,
			},
			{
				path: "/bills",
				element: <Bills />,
			},
			{
				path: "/add-bill",
				element: <AddBill />,
			},
			{
				path: "/update-bill/:id",
				element: <UpdateBill />,
			},
			{
				path: "/orders",
				element: <Orders />,
			},
			{
				path: "/add-order",
				element: <AddOrder />,
			},
			{
				path: "/update-order/:id",
				element: <UpdateOrder />,
			},
			{
				path: "/order-completed",
				element: <OrderCompleted />,
			},
			{
				path: "/shops",
				element: <Shops />,
			},
			{
				path: "/add-shop",
				element: <AddShop />,
			},
			{
				path: "/activities",
				element: <Activities />,
			},
			{
				path: "/background-tasks",
				element: <BackgroundTasks />,
			},
			{
				path: "/update-shop/:id",
				element: <UpdateShop />,
			},
			{
				path: "/users",
				element: <Users />,
			},
			{
				path: "/add-user",
				element: <AddUser />,
			},
			{
				path: "/stock-zone",
				element: <StockZone />,
			},
			{
				path: "/add-stock-zone",
				element: <AddStockZone />,
			},
			{
				path: "/update-stock-zone/:id",
				element: <UpdateStockZone />,
			},
			{
				path: "/update-user/:id",
				element: <UpdateUser />,
			},
			{
				path: "/shopify",
				element: <Shopify />,
			},
			{
				path: "/update-shopify-order/:id",
				element: <UpdateShopifyOrder />,
			},
			{
				path: "/merge-shopify-orders",
				element: <MergeShopifyOrders />,
			},
			{
				path: "/vendors",
				element: <Vendors />,
			},
			{
				path: "/add-vendor",
				element: <AddVendor />,
			},
			{
				path: "/update-vendor/:id",
				element: <UpdateVendor />,
			},
			{
				path: "/payments",
				element: <Payments />,
			},
			{
				path: "/add-payment",
				element: <AddPayment />,
			},
			{
				path: "/update-payment/:id",
				element: <UpdatePayment />,
			},
			{
				path: "/couriers",
				element: <Couriers />,
			},
			{
				path: "/add-courier",
				element: <AddCourier />,
			},
			{
				path: "/update-courier/:id",
				element: <UpdateCourier />,
			},
			{
				path: "/attendance",
				element: <Attendance />,
			},
			{
				path: "/mark-attendance",
				element: <MarkAttendance />,
			},
			{
				path: "/employees",
				element: <Employees />,
			},
			{
				path: "/add-employee",
				element: <AddEmployee />,
			},
			{
				path: "/update-employee/:id",
				element: <UpdateEmployee />,
			},
			{
				path: "/view-employee/:id",
				element: <ViewEmployee />,
			},
			{
				path: "/book-at-courier",
				element: <BookAtCourier />,
			},
			{
				path: "*",
				element: <Navigate to='/dashboard' replace />,
			},
		],
	},

	{
		path: "*",
		element: <Navigate to='/Login' replace />,
	},
]);
