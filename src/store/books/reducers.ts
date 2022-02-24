import persistStore from "../../persistStore";
import { getType } from "typesafe-actions";

import * as actions from "./actions";
import { BooksState, BooksAction } from "./types";

const initialState: BooksState = {
  value: persistStore.get("BOOKS"),
};

export default (
  state: BooksState = initialState,
  action: BooksAction
): BooksState => {
  switch (action.type) {
    case getType(actions.setBooks):
      const newBooks = action.payload.map((value) => ({
        ...value,
        key: value.bookId,
      }));
      persistStore.set("BOOKS", newBooks);
      return { ...state, value: newBooks };
    default:
      return state;
  }
};
