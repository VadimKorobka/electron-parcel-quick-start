import React from "react";
import { useSelector } from "react-redux";
import { User } from "../../../types";

import { RootState } from "../../../store/rootReducer";
import UsersList from "../../components/UsersList";
import { Redirect, Route, Switch } from "react-router";

const Users: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.value);
  const orders = useSelector((state: RootState) => state.orders.value);
  const [topUsers, setTopUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    setTopUsers(
      users.filter(
        (user) =>
          orders.filter((order) => user.userId === order.userId).length > 0
      )
    );
  }, [users]);

  return (
    <Switch>
      <Route path="/users/all" children={<UsersList users={users} />} />
      <Route path="/users/top" children={<UsersList users={topUsers} />} />
      <Redirect to="/users/all" />
    </Switch>
  );
};

export default React.memo(Users);
