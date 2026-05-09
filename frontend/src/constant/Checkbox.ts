export const VENDOR_CHECKBOX_DATA = {
  id: "vendors",
  key: "vendors",
  label: "Vendors",
  children: [
    { id: "view_vendors", key: "view_vendors", label: "View Vendors" },
    { id: "create_vendor", key: "create_vendor", label: "Create Vendor" },
    { id: "update_vendor", key: "update_vendor", label: "Update Vendor" },
  ],
};

export const COURIER_CHECKBOX_DATA = {
  id: "couriers",
  key: "couriers",
  label: "Couriers",
  children: [
    { id: "view_couriers", key: "view_couriers", label: "View Couriers" },
    { id: "create_courier", key: "create_courier", label: "Create Courier" },
    { id: "update_courier", key: "update_courier", label: "Update Courier" },
    { id: "delete_courier", key: "delete_courier", label: "Delete Courier" },
  ],
};
export const PRODUCT_CHECKBOX_DATA = {
  id: "products",
  key: "products",
  label: "Products",
  children: [
    { id: "view_products", key: "view_products", label: "View Products" },
    { id: "create_product", key: "create_product", label: "Create Product" },
    { id: "update_product", key: "update_product", label: "Update Product" },
    { id: "delete_product", key: "delete_product", label: "Delete Product" },
		{ id: "adjust_quantity", key: "adjust_quantity", label: "Adjust Quantity" },
		{ id: "sync_products", key: "sync_products", label: "Sync Products" },
  ],
};

export const ORDER_CHECKBOX_DATA = {
  id: "orders",
  key: "orders",
  label: "Orders",
  children: [
    { id: "view_orders", key: "view_orders", label: "View Orders" },
    { id: "create_order", key: "create_order", label: "Create Order" },
    { id: "update_order", key: "update_order", label: "Update Order" },
    { id: "cancelled_order", key: "cancelled_order", label: "Cancelled Order" },
    { id: "restore_order", key: "restore_order", label: "Restore Order" },
  ],
};

export const USER_CHECKBOX_DATA = {
  id: "users",
  key: "users",
  label: "Users",
  children: [
    { id: "view_users", key: "view_users", label: "View Users" },
    { id: "create_user", key: "create_user", label: "Create User" },
    { id: "update_user", key: "update_user", label: "Update User" },
    { id: "delete_user", key: "delete_user", label: "Delete User" },
  ],
};

export const SHOP_CHECKBOX_DATA = {
  id: "shop",
  key: "shop",
  label: "Shop",
  children: [
    { id: "view_shops", key: "view_shops", label: "View Shops" },
    { id: "create_shops", key: "create_shops", label: "Create Shops" },
    { id: "update_shops", key: "update_shops", label: "Update Shops" },
    { id: "delete_shops", key: "delete_shops", label: "Delete Shops" },
  ],
};

export const SHOPIFY_CHECKBOX_DATA = {
  id: "shopify",
  key: "shopify",
  label: "Shopify",
  children: [
    { id: "view_shopify", key: "view_shopify", label: "View Shopify" },
  ],
};

export const DASHBOARD_CHECKBOX_DATA = {
  id: "dashboard",
  key: "dashboard",
  label: "Dashboard",
  children: [
    { id: "view_dashboard", key: "view_dashboard", label: "View Dashboard" },
  ],
};

export const ANALYTICS_CHECKBOX_DATA = {
  id: "analytics",
  key: "analytics",
  label: "Analytics",
  children: [
    { id: "view_analytics", key: "view_analytics", label: "View Analytics" },
  ],
};

export const STOCK_ZONES_CHECKBOX_DATA = {
  id: "stock_zones",
  key: "stock_zones",
  label: "Stock Zones",
  children: [
    { id: "view_stock_zone", key: "view_stock_zone", label: "View Stock Zone" },
    { id: "add_stock_zone", key: "add_stock_zone", label: "Add Stock Zone" },
		{ id: "update_stock_zone", key: "update_stock_zone", label: "Update Stock Zones" },
		{ id: "delete_stock_zone", key: "delete_stock_zone", label: "Delete Stock Zones" },
  ],
};

export const BILLS_CHECKBOX_DATA = {
  id: "bills",
  key: "bills",
  label: "Bills",
  children: [
    { id: "view_bills", key: "view_bills", label: "View Bills" },
    { id: "create_bills", key: "create_bills", label: "Create Bills" },
    { id: "update_bills", key: "update_bills", label: "Update Bills" },
    { id: "delete_bills", key: "delete_bills", label: "Delete Bills" },
		{ id: "update_bills_status", key: "update_bills_status", label: "Update Bills Status" },
  ],
};

export const PAYMENTS_CHECKBOX_DATA = {
  id: "payments",
  key: "payments",
  label: "Payments",
  children: [
    { id: "view_payments", key: "view_payments", label: "View Payments" },
    { id: "create_payment", key: "create_payment", label: "Create Payment" },
    { id: "update_payment", key: "update_payment", label: "Update Payment" },
    { id: "delete_payment", key: "delete_payment", label: "Delete Payment" },
  ],
};

export const ACTIVITIES_CHECKBOX_DATA = {
	id:"activities",
	key:"activities",
	label:"Activities",
  children: [
		{id: "view_activities", key:"view_activities", label:"View Activities"}
	]
}

export const EMPLOYEE_CHECKBOX_DATA = {
	id: "employees",
	key: "employees",
	label: "Employees",
	children: [
		{ id: "view_employees", key: "view_employees", label: "View Employees" },
		{ id: "create_employee", key: "create_employee", label: "Create Employee" },
		{ id: "update_employee", key: "update_employee", label: "Update Employee" },
		{ id: "delete_employee", key: "delete_employee", label: "Delete Employee" },
	],
};

export const ATTENDANCE_CHECKBOX_DATA = {
	id: "attendance",
	key: "attendance",
	label: "Attendance",
	children: [
		{ id: "view_attendance", key: "view_attendance", label: "View Attendance" },
	],
};

export const BACKGROUND_TASKS_CHECKBOX_DATA = {
	id:"background_tasks",
	key:"background_tasks",
	label:"Background Tasks",
  children: [
		{id: "view_background_tasks", key:"view_background_tasks", label:"View Background Tasks"}
	]
}

export const ACCESS_MAP: { [key: string]: { label: string; parent: string } } =
  {
    view_vendors: { label: "View Vendors", parent: "Vendors" },
    create_vendor: { label: "Create Vendor", parent: "Vendors" },
    update_vendor: { label: "Update Vendor", parent: "Vendors" },

    view_couriers: { label: "View Couriers", parent: "Couriers" },
    create_courier: { label: "Create Courier", parent: "Couriers" },
    update_courier: { label: "Update Courier", parent: "Couriers" },
    delete_courier: { label: "Delete Courier", parent: "Couriers" },

    view_products: { label: "View Products", parent: "Products" },
    create_product: { label: "Create Product", parent: "Products" },
    update_product: { label: "Update Product", parent: "Products" },
    delete_product: { label: "Delete Product", parent: "Products" },
    import_products: { label: "Import Products", parent: "Products" },
    sync_products: { label: "Sync Products", parent: "Products" },

    view_orders: { label: "View Orders", parent: "Orders" },
    create_order: { label: "Create Order", parent: "Orders" },
    update_order: { label: "Update Order", parent: "Orders" },
    update_order_status: { label: "Update Order Status", parent: "Orders" },
    view_order_history: { label: "View Order history", parent: "Orders" },

    view_users: { label: "View Users", parent: "Users" },
    create_user: { label: "Create User", parent: "Users" },
    update_user: { label: "Update User", parent: "Users" },
    delete_user: { label: "Delete User", parent: "Users" },

    view_shops: { label: "View Shops", parent: "Shops" },
    create_shops: { label: "Create Shops", parent: "Shops" },
    update_shops: { label: "Update Shops", parent: "Shops" },
    delete_shops: { label: "Delete Shops", parent: "Shops" },

    view_shopify: { label: "View Shopify", parent: "Shopify" },

    view_dashboard: { label: "View Dashboard", parent: "Dashboard" },
    view_analytics: { label: "View Analytics", parent: "Analytics" },

    view_payments: { label: "View Payments", parent: "Payments" },
    create_payment: { label: "Create Payment", parent: "Payments" },
    update_payment: { label: "Update Payment", parent: "Payments" },
    delete_payment: { label: "Delete Payment", parent: "Payments" },

    view_background_tasks: {label: "View Background Tasks", parent: "Background Tasks"},

    view_attendance: { label: "View Attendance", parent: "Attendance" },

    view_employees: { label: "View Employees", parent: "Employees" },
    create_employee: { label: "Create Employee", parent: "Employees" },
    update_employee: { label: "Update Employee", parent: "Employees" },
    delete_employee: { label: "Delete Employee", parent: "Employees" },
};
export const ACCESS = {
  view_vendors: "view_vendors",
  create_vendor: "create_vendor",
  update_vendor: "update_vendor",

  view_couriers: "view_couriers",
  create_courier: "create_courier",
  update_courier: "update_courier",
  delete_courier: "delete_courier",

  view_products: "view_products",
  create_product: "create_product",
  update_product: "update_product",
  delete_product: "delete_product",
  import_products: "import_products",

  view_orders: "view_orders",
  create_order: "create_order",
  update_order: "update_order",
  update_order_status: "update_order_status",
  view_order_history: "view_order_history",

  view_users: "view_users",
  create_user: "create_user",
  update_user: "update_user",
  delete_user: "delete_user",

  view_stock_zone: "view_stock_zone",
  add_stock_zone: "add_stock_zone",
  update_stock_zone: "update_stock_zone",
  delete_stock_zone: "delete_stock_zone",

  view_shops: "view_shops",
  create_shop: "create_shops",
  update_shop: "update_shops",
  delete_shop: "delete_shops",

  view_shopify: "view_shopify",
  sync_products: "sync_products",

  view_dashboard: "view_dashboard",
  view_analytics: "view_analytics",
  view_activities: "view_activities",
  adjust_quantity: "adjust_quantity",
  view_payments: "view_payments",
  create_payment: "create_payment",
  update_payment: "update_payment",
  delete_payment: "delete_payment",

  view_background_tasks: "view_background_tasks",

  view_attendance: "view_attendance",

  view_employees: "view_employees",
  create_employee: "create_employee",
  update_employee: "update_employee",
  delete_employee: "delete_employee",
};
