import { Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { StoreFields } from "../../../types";
import "./style.less";

const { Header, Content } = Layout;

interface Props {
  children: React.ReactElement;
  defaultPage: StoreFields;
}

const PageLayout: React.FC<Props> = ({ children, defaultPage }) => {
  return (
    <Layout className="Layout">
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[defaultPage]}
        >
          <Menu.Item key="USERS">
            <Link to="/users">Картотека</Link>
          </Menu.Item>
          <Menu.Item key="BOOKS">
            <Link to="/books">Книги</Link>
          </Menu.Item>
          <Menu.Item key="ORDERS">
            <Link to="/orders">Облік</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
};

export default React.memo(PageLayout);
