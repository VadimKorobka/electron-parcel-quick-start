export interface Store {
  USERS: User[];
  BOOKS: Book[];
  ORDERS: Order[];
}

export type StoreFields = keyof Store;
export type State = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type OrderStatus = "IN_PROGRESS" | "COMPLETED";

export interface User {
  userId: string;
  name: string;
  surname: string;
  secondName: string;
  address: string;
  phone: string;
}

export interface UserExtended extends User {
  orders: OrderExtended[];
}

export interface Book {
  bookId: string;
  name: string;
  author: string;
  genre: string;
  deposit: number;
  rent: number;
  state: State;
}

export interface Order {
  orderId: string;
  bookId: string;
  userId: string;
  startDate: number;
  endDate: number;
  deposit: number;
  rent: number;
  status: OrderStatus;
}

export interface OrderExtended extends Order {
  book: Book;
}

export interface ExtendedOrder extends Order {
  book: Book;
  user: User;
}
