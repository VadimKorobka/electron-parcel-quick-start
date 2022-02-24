import { Book } from "../../types";
import { createAction } from "typesafe-actions";

export const setBooks = createAction(
  "books/SET_BOOKS",
  (books: Book[]) => books
)();
