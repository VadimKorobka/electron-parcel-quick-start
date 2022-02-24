import { Book } from "../../types";
import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export type BooksAction = ActionType<typeof actions>;

export type BooksState = {
  value: Book[];
};
