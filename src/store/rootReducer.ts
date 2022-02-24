import { combineReducers } from "redux";

import { StateType } from "typesafe-actions";
import usersReducer from "./users/reducers";
import booksReducer from "./books/reducers";
import ordersReducer from "./orders/reducers";
import { UsersAction } from "./users/types";
import { BooksAction } from "./books/types";
import { OrdersAction } from "./orders/types";

const rootReducer = combineReducers({
  users: usersReducer,
  books: booksReducer,
  orders: ordersReducer,
});

export type RootState = StateType<typeof rootReducer>;
export type RootAction = UsersAction | BooksAction | OrdersAction;

export default rootReducer;
