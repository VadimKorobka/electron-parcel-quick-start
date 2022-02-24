import React from "react";
import { v4 as uuidv4 } from "uuid";
import { connect, useSelector } from "react-redux";
import {
  Button,
  Card,
  Input,
  Modal,
  Table,
  Form,
  InputNumber,
  Dropdown,
  Menu,
} from "antd";

import Layout from "../../components/Layout";
import { RootAction, RootState } from "../../../store/rootReducer";
import { User, UserExtended } from "../../../types";
import { bindActionCreators, Dispatch } from "redux";
import * as userActions from "../../../store/users/actions";
import UsersHeader from "../UsersHeader";

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setUsers: userActions.setUsers,
    },
    dispatch
  );

interface Props {
  users: User[];
}

type UsersListProps = ReturnType<typeof mapDispatchToProps> & Props;

const UsersList: React.FC<UsersListProps> = ({ setUsers, users }) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [userToUpdate, setUserToUpdate] = React.useState<User>();
  const [extendedUsers, setExtendedUsers] = React.useState<UserExtended[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<UserExtended[]>([]);
  const allUsers = useSelector((state: RootState) => state.users.value);
  const orders = useSelector((state: RootState) => state.orders.value);
  const books = useSelector((state: RootState) => state.books.value);

  React.useEffect(() => {
    setExtendedUsers(
      users.map((user) => ({
        ...user,
        orders: orders
          .filter((order) => order.userId === user.userId)
          .map((order) => ({
            ...order,
            book: books.find((book) => book.bookId === order.bookId),
          })),
      }))
    );
  }, [users, orders, books]);

  React.useEffect(() => {
    setFilteredUsers(
      extendedUsers.filter((user) =>
        Object.values(user).join("").includes(searchValue)
      )
    );
  }, [searchValue, extendedUsers]);

  const deleteUser = (userId: string) => {
    setUsers(allUsers.filter((user) => user.userId !== userId));
  };

  const columns = [
    {
      title: "Прізвище",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "Ім'я",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "По батькові",
      dataIndex: "secondName",
      key: "secondName",
    },
    {
      title: "Адреса",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Історія замовлень",
      key: "action",
      render: (text, record: UserExtended) => (
        <Dropdown
          overlay={
            <Menu>
              {record.orders.map((order) => (
                <Menu.Item>
                  <p>{order.book.name}</p>
                </Menu.Item>
              ))}
            </Menu>
          }
          placement="bottomLeft"
        >
          <p>{record.orders.map((order) => order.book.name).join()}</p>
        </Dropdown>
      ),
    },
    // {
    //   title: "Дії",
    //   key: "action",
    //   render: (text, record) => (
    //     <Button
    //       type="primary"
    //       danger={true}
    //       onClick={() => deleteUser(record.userId)}
    //     >
    //       Видалити
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Layout defaultPage="USERS">
      <>
        <UsersHeader
          userToUpdate={userToUpdate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={false}
        />
      </>
    </Layout>
  );
};

export default React.memo(connect(null, mapDispatchToProps)(UsersList));
