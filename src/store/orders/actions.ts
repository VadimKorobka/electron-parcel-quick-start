import { Order } from "../../types";
import { createAction } from "typesafe-actions";

export const setOrders = createAction(
  "orders/SET_ORDERS",
  (orders: Order[]) => orders
)();
