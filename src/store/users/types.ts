import { User } from "../../types";
import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type UsersAction = ActionType<typeof actions>;

export type UsersState = {
  value: User[];
};
