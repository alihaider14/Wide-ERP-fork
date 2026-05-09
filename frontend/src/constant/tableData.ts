export const BILL_FORM_HEAD_DATA = [
	{ title: "SKU", className: "pl-5 md:pl-10" },
	{ title: "Cost", className: "text-start" },
	{ title: "QTY", className: "text-start" },
	{ title: "Total Cost", className: "text-start" },
	{ title: "Actions", className: "text-start" },
];
export const BILLS_HEAD_DATA = [
	{ title: "Bill No.", className: "pl-5 md:pl-10 text-semi-black" },
	{ title: "Vendor", className: "text-semi-black" },
	{ title: "Amount", className: "text-semi-black" },
	{ title: "Items", className: "text-semi-black" },
	{ title: "Bill Date", className: "text-semi-black" },
	{ title: "Created At", className: "text-semi-black" },
	{ title: "Updated At", className: "text-semi-black" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10 text-semi-black" },
];
export const PAYMENTS_HEAD_DATA = [
	{
		title: "P. No.",
		className:
			"px-5 md:pl-10 2xl:pl-5  2xl:w-[60px] 2xl:min-w-[60px]  text-semi-black",
	},
	{
		title: "Vendor",
		className: "2xl:w-[566px] 2xl:min-w-[566px]  2xl:p-0 text-semi-black",
	},
	{
		title: "Paid Amount",
		className: "2xl:w-[100px] 2xl:min-w-[100px] 2xl:p-0 text-semi-black",
	},
	{
		title: "Current Bal.",
		className: "2xl:w-[120px] 2xl:min-w-[120px] 2xl:p-0 text-semi-black",
	},
	{
		title: "Remaining Bal.",
		className: "2xl:w-[120px] 2xl:min-w-[120px] 2xl:p-0 text-semi-black",
	},
	{
		title: "Paid At",
		className: "2xl:w-[100px] 2xl:min-w-[100px] 2xl:p-0 text-semi-black",
	},
	{
		title: "Updated At",
		className: "2xl:w-[100px] 2xl:min-w-[100px] 2xl:p-0 text-semi-black",
	},
	{
		title: "Actions",
		className:
			"pr-5 md:pr-10 2xl:px-0 2xl:pr-5 2xl:w-[92px] 2xl:min-w-[92px]   text-semi-black",
	},
];

export const ADJUSTQTY_HEAD_DATA = [
	{ title: "Reason", className: "pl-5 md:pl-10" },
	{ title: "Cost", className: "" },
	{ title: "QTY", className: "" },
	{ title: "Remaining QTY", className: "" },
	{ title: "Updated At", className: "" },
	{ title: "Created by", className: "" },
	{ title: "Actions", className: "" },
];

export const ORDERS_HEAD_DATA = [
	{ title: "Order", className: "pl-5 md:pl-10" },
	{ title: "Customer Name", className: "" },
	{ title: "Phone", className: "" },
	{ title: "Amount", className: "" },
	{ title: "Items", className: "" },
	{ title: "Status", className: "" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const ORDER_CART_HEAD_DATA = [
	{ title: "SKU", className: "pl-5 md:pl-10" },
	{ title: "Price", className: "text-center" },
	{ title: "QTY", className: "text-center" },
	{ title: "Total Price", className: "text-center" },
	{ title: "Actions", className: "text-center" },
];

export const ORDER_ITEMS_HEAD_DATA = [
	{ title: "SKU", className: "pl-5 md:pl-10" },
	{ title: "Price x Qty", className: "text-center" },
	{ title: "Total", className: "text-center" },
];
export const HISTORY_HEAD_DATA = [{ title: "History", className: "pl-5" }];
export const SHOPIFY_PRODUCT_DATA = [
	{ title: "Name", className: "pl-5 md:pl-10  min-w-[300px]!" },
	{
		title: "SKU",
		className: "min-w-[150px]",
	},
	{ title: "Price (Rs.)", className: "min-w-[80px]" },
	{ title: "QTY", className: "min-w-[60px]" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10 min-w-[60px]" },
];

export const SHOPIFY_PRODUCT_DATA_CUSTOM = [
	{ title: "Name", className: "pl-5   min-w-[430px]!" },
	{
		title: "SKU",
		className: "min-w-[150px]",
	},
	{ title: "Price (Rs.)", className: "min-w-[80px]" },
	{ title: "QTY", className: "min-w-[60px]" },
	{ title: "Actions", className: "text-center pr-5  min-w-[60px]" },
];

export const PRINT_PRODUCT_HEAD_DATA = [
	{ title: "Name", className: "pl-5 w-full" },
	{ title: "Quantity", className: "" },
	{ title: "", className: "pr-5 min-w-[64px]" },
];

export const USER_HEAD_DATA = [
	{ title: "User ID", className: "pl-5 md:pl-10" },
	{ title: "Name", className: "" },
	{ title: "Email", className: "" },
	{ title: "Phone", className: "" },
	{ title: "Designation", className: "" },
	{ title: "Updated At", className: "" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const STOCK_ZONE_HEAD_DATA = [
	{ title: "Name", className: "px-7" },
	{ title: "Products", className: "" },
	{ title: "Stock", className: "" },
	{ title: "Updated At", className: "" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const VENDOR_HEAD_DATA = [
	{ title: "Name", className: "px-7" },
	{ title: "Phone", className: "" },
	{ title: "Address", className: "" },
	{ title: "To Pay", className: "" },
	{ title: "Updated At", className: "" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const EMPLOYEE_HEAD_DATA = [
	{ title: "Name", className: "px-7 min-w-[150px]" },
	{ title: "Attendance", className: "min-w-[85px]" },
	{ title: "Designation", className: "min-w-[100px]" },
	{ title: "Phone", className: "min-w-[120px]" },
	{ title: "Last Paid", className: "min-w-[180px]" },
	{ title: "Experience", className: "min-w-[80px]" },
	{ title: "Status", className: "min-w-[100px]" },
	{ title: "Actions", className: "text-left  pr-5 md:pr-10 min-w-[196px]" },
];

export const EMPLOYEE_SALARY_HISTORY_HEAD_DATA = [
	{ title: "Month", className: "pl-5 min-w-[112px] w-[112px]" },
	{ title: "On Time", className: "min-w-[85px] w-[85px]" },
	{ title: "Late", className: "min-w-[85px] w-[85px]" },
	{ title: "Absence", className: "min-w-[85px] w-[85px]" },
	{ title: "Leave", className: "min-w-[85px] w-[85px]" },
	{ title: "Base Salary", className: "min-w-[120px] w-[120px]" },
	{ title: "Commission", className: "min-w-[120px] w-[120px]" },
	{ title: "Other", className: "min-w-[120px] w-[120px]" },
	{ title: "Paid At", className: "min-w-[100px] w-[100px]" },
	{ title: "Created At", className: "min-w-[100px] w-[100px]" },
	{ title: "Actions", className: "min-w-[60px] w-[60px] pr-5" },
];

export const ATTENDANCE_HEAD_DATA = [
	{ title: "Name", className: "pl-7 min-w-[150px]" },
	{ title: "Date", className: "min-w-[160px]" },
	{ title: "Check In - Out", className: "min-w-[200px]" },
	{ title: "Duration", className: "min-w-[100px]" },
	{ title: "Overtime", className: "min-w-[100px]" },
	{ title: "Marked By", className: "min-w-[140px]" },
	{ title: "Status", className: "min-w-[110px]" },
	{ title: "Actions", className: "text-center min-w-[60px]" },
];

export const COURIER_HEAD_DATA = [
	{ title: "Name", className: "px-7" },
	{ title: "Shop", className: "" },
	{ title: "Status", className: "" },
	{ title: "Updated At", className: "" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const ACTIVITIES_HEAD_DATA = [
	{ title: "Date Time", className: "pl-5 md:pl-10" },
	{ title: "Activities", className: "" },
];

export const BACKGROUND_TASKS_HEAD_DATA = [
	{ title: "Task#", className: "pl-5 md:pl-10" },
	{ title: "Note", className: "w-full" },
	{ title: "Type", className: "" },
	{ title: "Status", className: "" },
	{ title: "Last Run At", className: "" },
	{ title: "Created At", className: "" },
];

export const SHOPS_HEAD_DATA = [
	{ title: "Name", className: "px-7" },
	{ title: "Key" },
	{ title: "Phone" },
	{ title: "Social Media" },
	{ title: "Meta Ads", className: "pl-7" },
	{ title: "Status" },
	{ title: "Actions", className: "pr-5 md:pr-10" },
];

export const ANALYTICS_HEAD_DATA = [
	{ title: "Shop", className: "px-7" },
	{ title: "Sales" },
	{ title: "Avg. Sales" },
	{ title: "Orders" },
	{ title: "Avg. Orders" },
	{ title: "Spent" },
	{ title: "Avg. Spent" },
	{ title: "ROAS" },
	{ title: "Balance" },
];

export const PRODUCT_HEAD_DATA = [
	{ title: "Name", className: "" },
	{
		title: "SKU",
		className: "",
		sortable: true,
		sortKey: "sku",
	},
	{ title: "Barcode", className: "" },
	{ title: "Price", className: "", sortable: true, sortKey: "price" },
	{ title: "QTY", className: "", sortable: true, sortKey: "qty" },
	{ title: "Actions", className: "text-center pr-5 md:pr-10" },
];

export const ANALYTICS_BASE_HEAD_DATA = [
	{ title: "Shop", className: "" },
	{ title: "Sales" },
	{ title: "Avg. Sales" },
	{ title: "Orders" },
	{ title: "Avg. Orders" },
	{ title: "Spent" },
	{ title: "Avg. Spent" },
	{ title: "ROAS" },
	{ title: "Balance" },
];

export const SHOPIFY_HEAD_DATA = [
	{ title: "Order", className: "pl-5 md:pl-10" },
	{ title: "Date", className: "" },
	{ title: "Customer", className: "" },
	{ title: "Total", className: "" },
	{ title: "Items", className: "" },
	{ title: "Status", className: "" },
	{ title: "Tracking", className: "" },
	{ title: "Destination", className: "" },
];

export const SHOP_LIST = [
	"Wide Traders",
	"99 Variety",
	"Wide Dimension",
	"Wide Wholesale",
];

export const BASE_HEAD = [
	{ title: "Order", key: "Order", className: "" },
	{ title: "Shop", key: "Shop", className: "" },
	{ title: "Date", key: "Date", className: "" },
	{ title: "Customer", key: "Customer", className: "" },
	{ title: "Total", key: "Total", className: "" },
	{ title: "Printed", key: "Printed", className: "text-center" },
	{ title: "Status", key: "Status", className: "" },
	{ title: "Ful. Status", key: "Ful. Status", className: "" },
	{ title: "Tracking", key: "Tracking", className: "" },
	{ title: "Destination", key: "Destination", className: "" },
];

export const STATUS_CARDS = [
	{ label: "Pending", value: "Pending" },
	{ label: "Ready to Ship", value: "Ready to Ship" },
	{ label: "Booked", value: "Booked" },
	{ label: "Scanned", value: "Scanned" },
	{ label: "In-Transit", value: "In-Transit" },
	{ label: "Out for Delivery", value: "Out for Delivery" },
	{ label: "Attempted", value: "Attempted" },
	{ label: "Failed", value: "Failed" },
	{ label: "Delivered", value: "Delivered" },
	{ label: "Rec. Return", value: "Rec. Return" },
	{ label: "Cancelled", value: "Cancelled" },
];
