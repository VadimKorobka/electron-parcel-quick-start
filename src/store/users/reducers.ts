import persistStore from "../../persistStore";
import { getType } from "typesafe-actions";

import * as actions from "./actions";
import { UsersState, UsersAction } from "./types";

const initialState: UsersState = {
  value: persistStore.get("USERS"),
};

export default (
  state: UsersState = initialState,
  action: UsersAction
): UsersState => {
  switch (action.type) {
    case getType(actions.setUsers):
      const newUsers = action.payload.map((value) => ({
        ...value,
        key: value.userId,
      }));
      persistStore.set("USERS", newUsers);
      return { ...state, value: newUsers };
    default:
      return state;
  }
};
