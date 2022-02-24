import { User } from "../../types";
import { createAction } from "typesafe-actions";

export const setUsers = createAction(
  "users/SET_USERS",
  (users: User[]) => users
)();

export const resetUsers = createAction("users/RESET_USERS")();
