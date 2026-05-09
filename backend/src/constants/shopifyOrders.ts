export const SHOPIFY_STATUS_QUERY_MAP: Record<string, string> = {
	"In-Transit": "delivery_status:IN_TRANSIT",
	"Out for Delivery": "delivery_status:OUT_FOR_DELIVERY",
	Attempted: "delivery_status:ATTEMPTED_DELIVERY",
	Failed: "delivery_status:FAILURE",
	Delivered: "delivery_status:DELIVERED",
	"Ready to Ship": 'metafields.custom.wd_status:"Ready to Ship"',
	Scanned: 'metafields.custom.wd_status:"Scanned"',
	"Rec. Return": 'metafields.custom.wd_status:"Return Received"',
	Cancelled:
		'delivery_status:CANCELED OR metafields.custom.wd_status:"Cancelled"',
	Booked: "fulfillment_status:fulfilled",
};

export const SHOPIFY_CLIENT_FILTER_TABS = new Set([
	"Pending",
	"Ready to Ship",
	"Scanned",
	"Booked",
]);

export const SHOPIFY_UPDATED_AT_TABS = new Set(["Rec. Return", "Scanned"]);

export const SHOPIFY_ORDER_GID_PREFIX = "gid://shopify/Order/";

export const SHOPIFY_SALES_QUERY = `
	query($query: String!, $after: String) {
		orders(query: $query, first: 250, after: $after, sortKey: CREATED_AT) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				cursor
				node {
					currentTotalPriceSet {
						shopMoney {
							amount
						}
					}
				}
			}
		}
	}
`;

export const GET_SHOPIFY_PRODUCTS_QUERY = `
  query GetProducts($search: String!, $first: Int!, $after: String) {
    products(first: $first, query: $search, after: $after) {
      edges {
        cursor
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                sku
                price
                inventoryQuantity
				        availableForSale
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const GET_VARIANTS_STOCK = `
  query GetVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        sku
        inventoryQuantity
        price
      }
    }
  }
`;

export const GET_SHOPIFY_ORDERS_BY_ORDER_IDS = `    query getOrder($id: ID!) {
        order(id: $id) {
          id
          note
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          currentTotalDiscountsSet { shopMoney { amount } }
          currentShippingPriceSet { shopMoney { amount } }

          wd_status: metafield(namespace: "custom", key: "wd_status") {
            value
          }
          wd_shipper_remarks: metafield(namespace: "custom", key: "wd_shipper_remarks") {
            value
          }

          lineItems(first: 50) {
            edges {
              node {
                id
                title
                sku
                currentQuantity
                variant { id }
                image { originalSrc }
                originalUnitPriceSet {
                  shopMoney { amount }
                }
              }
            }
          }

          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            zip
            country
            phone
          }
        }
      }`;

export const ORDER_CANCEL_MUTATION = `
        mutation OrderCancel($orderId: ID!, $reason: OrderCancelReason!, $refund: Boolean!, $restock: Boolean!) {
          orderCancel(orderId: $orderId, reason: $reason, refund: $refund, restock: $restock) {
            job {
              id
              done
            }
            orderCancelUserErrors {
              field
              message
            }
          }
        }
      `;

export const ORDER_DELETE_MUTATION = `
        mutation OrderDelete($orderId: ID!) {
          orderDelete(orderId: $orderId) {
            deletedId
            userErrors {
              field
              message
            }
          }
        }
      `;

export const GET_ORDER_STATUS_QUERY = `
        query GetOrderStatus($id: ID!) {
          order(id: $id) {
            id
            cancelledAt
            displayFinancialStatus
          }
        }
      `;
