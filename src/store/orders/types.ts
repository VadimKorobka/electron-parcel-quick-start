import { Order } from "../../types";
import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type OrdersAction = ActionType<typeof actions>;

export type OrdersState = {
  value: Order[];
};
