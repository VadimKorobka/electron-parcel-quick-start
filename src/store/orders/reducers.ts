import persistStore from "../../persistStore";
import { getType } from "typesafe-actions";

import * as actions from "./actions";
import { OrdersState, OrdersAction } from "./types";

const initialState: OrdersState = {
  value: persistStore.get("ORDERS"),
};

export default (
  state: OrdersState = initialState,
  action: OrdersAction
): OrdersState => {
  switch (action.type) {
    case getType(actions.setOrders):
      const newOrders = action.payload.map((value) => ({
        ...value,
        key: value.bookId,
      }));
      persistStore.set("ORDERS", newOrders);
      return { ...state, value: newOrders };
    default:
      return state;
  }
};
