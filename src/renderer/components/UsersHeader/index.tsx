import React, { ChangeEvent } from "react";
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
  Space,
} from "antd";

import Layout from "../../components/Layout";
import { RootAction, RootState } from "../../../store/rootReducer";
import { User } from "../../../types";
import { bindActionCreators, Dispatch } from "redux";
import * as userActions from "../../../store/users/actions";
import { Link, useLocation } from "react-router-dom";
import Search from "antd/lib/input/Search";

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setUsers: userActions.setUsers,
    },
    dispatch
  );

interface Props {
  userToUpdate?: User;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

type UsersHeaderProps = ReturnType<typeof mapDispatchToProps> & Props;

const UsersHeader: React.FC<UsersHeaderProps> = ({
  setUsers,
  userToUpdate,
  searchValue,
  setSearchValue,
}) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [createUserModal, setCreateUserModal] = React.useState(false);
  const allUsers = useSelector((state: RootState) => state.users.value);

  const handleNewUser = (values: any) => {
    setUsers([...allUsers, { ...values, userId: uuidv4() }]);
    closeNewUserModal();
  };

  const closeNewUserModal = () => {
    form.resetFields();
    setCreateUserModal(false);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div>
      <Space
        direction="horizontal"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem 2rem",
        }}
      >
        <Space direction="vertical">
          <Space direction="horizontal">
            <Link
              to="/users/all"
              style={{
                textDecoration:
                  location.pathname === "/users/all" ? "underline" : "",
              }}
            >
              Список клієнтів
            </Link>
            <Link
              to="/users/top"
              style={{
                textDecoration:
                  location.pathname === "/users/top" ? "underline" : "",
              }}
            >
              Список постійних клієнтів
            </Link>
          </Space>
          <Search
            placeholder="Пошук"
            allowClear
            onChange={onChange}
            value={searchValue}
          />
        </Space>
        <Button type="primary" onClick={() => setCreateUserModal(true)}>
          Додати клієнта
        </Button>
      </Space>
      <Modal
        title={<p style={{ textAlign: "center" }}>Додати нового читача</p>}
        centered
        visible={createUserModal}
        footer={null}
        onCancel={closeNewUserModal}
      >
        <Form
          form={form}
          onFinish={handleNewUser}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          initialValues={{
            ...userToUpdate,
          }}
          layout="horizontal"
        >
          <Form.Item
            label="Ім'я"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input client's name!",
              },
            ]}
          >
            <Input placeholder="Ім'я" maxLength={30} />
          </Form.Item>
          <Form.Item
            label="Прізвище"
            name="surname"
            rules={[
              {
                required: true,
                message: "Please input client's surname!",
              },
            ]}
          >
            <Input placeholder="Прізвище" maxLength={30} />
          </Form.Item>
          <Form.Item label="По батькові" name="secondName">
            <Input placeholder="По батькові" maxLength={30} />
          </Form.Item>
          <Form.Item
            label="Адреса"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input client's address!",
              },
            ]}
          >
            <Input placeholder="Адреса" maxLength={60} />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input client's phone!",
              },
              {
                pattern: new RegExp("^\\d+$"),
                message: "Client's phone should include only digits",
              },
              {
                min: 8,
                max: 12,
                message: "Client's phone length from 8 to 12!",
              },
            ]}
          >
            <Input
              placeholder="Телефон"
              minLength={8}
              maxLength={12}
              width={"100%"}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зберігти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default React.memo(connect(null, mapDispatchToProps)(UsersHeader));
