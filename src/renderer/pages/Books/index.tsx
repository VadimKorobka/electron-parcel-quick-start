import React from "react";
import { v4 as uuidv4 } from "uuid";
import { connect, useSelector } from "react-redux";
import { Button, Card, Input, Modal, Table, Form, InputNumber } from "antd";

import Layout from "../../components/Layout";
import { RootAction, RootState } from "../../../store/rootReducer";
import { Book } from "../../../types";
import { bindActionCreators, Dispatch } from "redux";
import * as bookActions from "../../../store/books/actions";

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setBooks: bookActions.setBooks,
    },
    dispatch
  );

type BooksProps = ReturnType<typeof mapDispatchToProps>;
const Books: React.FC<BooksProps> = ({ setBooks }) => {
  const [form] = Form.useForm();
  const [createBookModal, setCreateBookModal] = React.useState(false);
  const books = useSelector((state: RootState) => state.books.value);

  const handleNewBook = (values: any) => {
    setBooks([...books, { ...values, bookId: uuidv4() }]);
    closeNewBookModal();
  };

  const deleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.bookId !== bookId));
  };

  const closeNewBookModal = () => {
    form.resetFields();
    setCreateBookModal(false);
  };

  const columns = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Автор",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Жанр",
      dataIndex: "genre",
      key: "genre",
    },
    {
      title: "Запорука",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Вартість",
      dataIndex: "rent",
      key: "rent",
    },
    {
      title: "Стан",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Дії",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          danger={true}
          onClick={() => deleteBook(record.bookId)}
        >
          Видалити
        </Button>
      ),
    },
  ];

  return (
    <Layout defaultPage="BOOKS">
      <Card
        type="inner"
        title="Список книг"
        extra={
          <Button type="primary" onClick={() => setCreateBookModal(true)}>
            Додати книгу
          </Button>
        }
      >
        <Table columns={columns} dataSource={books} pagination={false} />
        <Modal
          title="Створення книги"
          centered
          visible={createBookModal}
          footer={null}
          onCancel={closeNewBookModal}
        >
          <Form
            form={form}
            onFinish={handleNewBook}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            initialValues={{
              deposit: 100,
              rent: 20,
              state: 10,
            }}
          >
            <Form.Item
              label="Назва"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input book's name!",
                },
              ]}
            >
              <Input placeholder="Назва" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Автор"
              name="author"
              rules={[
                {
                  required: true,
                  message: "Please input book's author!",
                },
              ]}
            >
              <Input placeholder="Автор" maxLength={50} />
            </Form.Item>
            <Form.Item
              label="Жанр"
              name="genre"
              rules={[
                {
                  required: true,
                  message: "Please input book's genre!",
                },
              ]}
            >
              <Input placeholder="Жанр" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Запорука"
              name="deposit"
              rules={[
                {
                  required: true,
                  message: "Please input book's deposit!",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={10000}
                placeholder="Запорука"
                width={"100%"}
              />
            </Form.Item>
            <Form.Item
              label="Вартість оренди"
              name="rent"
              rules={[
                {
                  required: true,
                  message: "Please input book's rent!",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={10000}
                placeholder="Вартість"
                width={"100%"}
              />
            </Form.Item>
            <Form.Item
              label="Стан книги"
              name="state"
              rules={[
                {
                  required: true,
                  message: "Please input book's state!",
                },
              ]}
            >
              <InputNumber min={1} max={10} placeholder="Стан" width={"100%"} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Зберігти
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Layout>
  );
};

export default React.memo(connect(null, mapDispatchToProps)(Books));
