import {
	Cart,
	Users,
	Products,
	Dashboard,
	Shopify,
	Shops,
	Analytics,
	StockZones,
	ActivityHeartbeat,
	UsersGroup,
	UserDollar,
	TruckDelivery,
	receiptSide,
	CashMinus,
	BackgroundTasks,
	FingerprintScan
} from "@/assets/svg";
import { ACCESS } from "./Checkbox";

export const dashboardAccessList = [ACCESS.view_dashboard];

export const analyticsAccessList = [ACCESS.view_analytics];

export const activitiesAccessList = [ACCESS.view_activities];

export const vendorsAccessList = [
	ACCESS.view_vendors,
	ACCESS.create_vendor,
	ACCESS.update_vendor,
];

export const couriersAccessList = [
	ACCESS.view_couriers,
	ACCESS.create_courier,
	ACCESS.update_courier,
	ACCESS.delete_courier,
];

export const shopifyAccessList = [ACCESS.view_shopify];

export const shopAccessList = [
	ACCESS.view_shops,
	ACCESS.create_shop,
	ACCESS.update_shop,
	ACCESS.delete_shop,
];

export const stockZoneAccessList = [
	ACCESS.view_stock_zone,
	ACCESS.add_stock_zone,
	ACCESS.update_stock_zone,
	ACCESS.delete_stock_zone,
];

export const productAccessList = [
	ACCESS.view_products,
	ACCESS.create_product,
	ACCESS.update_product,
	ACCESS.delete_product,
];
export const billsAccessList = [ACCESS.view_orders];

export const paymentsAccessList = [ACCESS.view_payments];

export const orderAccessList = [
	ACCESS.view_orders,
	ACCESS.create_order,
	ACCESS.update_order,
	ACCESS.update_order_status,
];

export const userAccessList = [
	ACCESS.view_users,
	ACCESS.create_user,
	ACCESS.update_user,
	ACCESS.delete_user,
];

export const backgroundTasksList = [ACCESS.view_background_tasks];

export const attendanceAccessList = [ACCESS.view_attendance];

export const employeesAccessList = [
	ACCESS.view_employees,
	ACCESS.create_employee,
	ACCESS.update_employee,
	ACCESS.delete_employee,
];

export const SIDE_BAR_DATA = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Dashboard,
		access: dashboardAccessList,
	},
	{
		title: "Products",
		url: "/products",
		icon: Products,
		access: productAccessList,
	},
	{
		title: "Shopify",
		url: "/shopify",
		icon: Shopify,
		access: shopifyAccessList,
	},
	{
		title: "Orders",
		url: "/orders",
		icon: Cart,
		access: orderAccessList,
	},
	{
		title: "Shops",
		url: "/shops",
		icon: Shops,
		access: shopAccessList,
	},
	{
		title: "Analytics",
		url: "/analytics",
		icon: Analytics,
		access: analyticsAccessList,
	},
	{
		title: "Stock Zone",
		url: "/stock-zone",
		icon: StockZones,
		access: stockZoneAccessList,
	},
	{
		title: "Activities",
		url: "/activities",
		icon: ActivityHeartbeat,
		access: activitiesAccessList,
	},
	{
		title: "Bills",
		url: "/bills",
		icon: receiptSide,
		access: billsAccessList,
	},
	{
		title: "Vendors",
		url: "/vendors",
		icon: UserDollar,
		access: vendorsAccessList,
	},
	{
		title: "Payments",
		url: "/payments",
		icon: CashMinus,
		access: paymentsAccessList,
	},
	{
		title: "Couriers",
		url: "/couriers",
		icon: TruckDelivery,
		access: couriersAccessList,
	},
	{	title: "Employees",
		url: "/employees",
		icon: UsersGroup,
		access: employeesAccessList,
	},
	{
		title: "Attendance",
		url: "/attendance",
		icon: FingerprintScan,
		access: attendanceAccessList,
	},
	{
		title:"Background Tasks",
		url:"/background-tasks",
		icon: BackgroundTasks,
		access: backgroundTasksList
	},

	{
		title: "Users",
		url: "/users",
		icon: Users,
		access: userAccessList,
	},
];
