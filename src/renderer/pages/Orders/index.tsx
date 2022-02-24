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
  Tag,
  Select,
  DatePicker,
  Typography,
  Divider,
} from "antd";

import Layout from "../../components/Layout";
import { RootAction, RootState } from "../../../store/rootReducer";
import { ExtendedOrder, Order } from "../../../types";
import { bindActionCreators, Dispatch } from "redux";
import * as ordersActions from "../../../store/orders/actions";
import * as booksActions from "../../../store/books/actions";

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setOrders: ordersActions.setOrders,
      setBooks: booksActions.setBooks,
    },
    dispatch
  );

const { Option } = Select;
const { RangePicker } = DatePicker;

type OrdersProps = ReturnType<typeof mapDispatchToProps>;
const Orders: React.FC<OrdersProps> = ({ setOrders, setBooks }) => {
  const [formCreation] = Form.useForm();
  const [formCompletion] = Form.useForm();
  const [createOrderModal, setCreateOrderModal] = React.useState(false);
  const [completeOrderModal, setCompleteOrderModal] =
    React.useState<string>("");
  const [orderToComplete, setOrderToComplete] =
    React.useState<ExtendedOrder | null>(null);
  const [discount, setDiscount] = React.useState(0);
  const [rent, setRent] = React.useState(0);
  const [deposit, setDeposit] = React.useState(0);
  const [moneyBack, setMoneyBack] = React.useState(0);
  const [orders, setExtendedOrders] = React.useState<ExtendedOrder[]>([]);
  console.log("🚀 ~ file: index.tsx ~ line 44 ~ orders", orders);
  const rawOrders = useSelector((state: RootState) => state.orders.value);
  console.log("🚀 ~ file: index.tsx ~ line 46 ~ rawOrders", rawOrders);
  const users = useSelector((state: RootState) => state.users.value);
  console.log("🚀 ~ file: index.tsx ~ line 38 ~ users", users);
  const books = useSelector((state: RootState) => state.books.value);

  React.useEffect(() => {
    setExtendedOrders(
      rawOrders.map((order) => ({
        ...order,
        book: books.find((book) => book.bookId === order.bookId),
        user: users.find((user) => user.userId === order.userId),
      }))
    );
  }, [rawOrders]);

  const handleNewOrder = (values: any) => {
    const newOrder: Order = {
      orderId: uuidv4(),
      bookId: values.bookId,
      userId: values.userId,
      startDate: values.dateRange[0].unix(),
      endDate: values.dateRange[1].unix(),
      deposit,
      rent,
      status: "IN_PROGRESS",
    };
    setOrders([...orders, newOrder]);
    closeNewOrderModal();
  };

  const completeOrder = () => {
    setOrders(
      orders.map((order) =>
        order.orderId !== orderToComplete.orderId
          ? order
          : { ...order, status: "COMPLETED" }
      )
    );
    setBooks(
      books.map((book) =>
        book.bookId !== orderToComplete.bookId
          ? book
          : { ...book, state: formCompletion.getFieldValue("state") }
      )
    );
    closeCompleteOrderModal();
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.orderId !== orderId));
  };

  const closeNewOrderModal = () => {
    formCreation.resetFields();
    setCreateOrderModal(false);
  };

  const closeCompleteOrderModal = () => {
    formCompletion.resetFields();
    setCompleteOrderModal("");
  };

  const recalculateMoneyBack = (value, values) => {
    if (values.state && values.datePicker) {
      let surcharge = 0;
      surcharge +=
        ((orderToComplete.book.state - values.state) / 10) *
        orderToComplete.deposit;
      surcharge +=
        orderToComplete.rent *
        Math.round(
          (values.datePicker.unix() - orderToComplete.endDate) / 86400
        );
      setMoneyBack(orderToComplete.deposit - surcharge);
    }
  };

  const columns = [
    {
      title: "Назва",
      dataIndex: "book.name",
      key: "bookName",
      render: (text, record) => record.book.name,
    },
    {
      title: "Автор",
      dataIndex: "book.author",
      key: "author",
      render: (text, record) => record.book.author,
    },
    {
      title: "Клієнт",
      dataIndex: "user.name",
      key: "client",
      render: (text, record) => `${record.user.surname} ${record.user.name}`,
    },
    {
      title: "Дата видачі",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Дедлайн",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (text, record: Order) => (
        <Tag color={record.status === "COMPLETED" ? "green" : "yellow"}>
          {record.status.toLocaleLowerCase()}
        </Tag>
      ),
    },
    {
      title: "Дії",
      key: "action",
      render: (text, record) =>
        record.status === "COMPLETED" ? (
          <Button
            type="primary"
            danger={true}
            onClick={() => deleteOrder(record.orderId)}
          >
            Видалити
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setOrderToComplete(record);
              setCompleteOrderModal(record.orderId);
            }}
          >
            Прийняти
          </Button>
        ),
    },
  ];

  const handleFieldsChanging = (value, values) => {
    const { userId, bookId, dateRange } = values;
    if (dateRange && userId && bookId) {
      try {
        const discount =
          orders.filter((order) => order.userId === userId).length > 5
            ? 0.1
            : 0;
        setDiscount(discount);
        const { rent, deposit } = books.find((book) => book.bookId === bookId);
        setRent(rent * (dateRange[1].diff(dateRange[0], "days") + 1));
        setDeposit(deposit);
      } catch (error) {
        console.error("handleFieldsChanging ~ error", error);
      }
    }
  };

  return (
    <Layout defaultPage="ORDERS">
      <Card
        type="inner"
        title="Облік видач книг"
        extra={
          <Button type="primary" onClick={() => setCreateOrderModal(true)}>
            Видати книгу
          </Button>
        }
      >
        <Table columns={columns} dataSource={orders} pagination={false} />
        <Modal
          title="Видача книги"
          centered
          visible={createOrderModal}
          footer={null}
          onCancel={closeNewOrderModal}
        >
          <Form
            form={formCreation}
            onFinish={handleNewOrder}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            onValuesChange={handleFieldsChanging}
          >
            <Form.Item
              name="userId"
              label="Клієнт"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Виберіть клієнта" allowClear>
                {users.map((user) => (
                  <Option value={user.userId} key={user.userId}>
                    {user.surname} {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="bookId"
              label="Книга"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Виберіть книгу" allowClear>
                {books.map((book) => (
                  <Option value={book.bookId} key={book.bookId}>
                    {book.name} - {book.author}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="dateRange"
              label="Сроки видачі"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <RangePicker />
            </Form.Item>
            <Divider />
            <Typography.Text>Задаток: {deposit}</Typography.Text>
            <Divider />
            <Typography.Text>Вартість: {rent}</Typography.Text>
            <Divider />
            <Typography.Text>
              Знижка(за 5+ повернень книжок у відмінному стані): {discount}%
            </Typography.Text>
            <Divider />
            <Typography.Text>
              До сплати: {deposit + rent * (1 - discount)}
            </Typography.Text>
            <Divider />
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Завершення прокату"
          centered
          visible={!!completeOrderModal}
          footer={null}
          onCancel={closeCompleteOrderModal}
        >
          <Form
            form={formCompletion}
            onFinish={completeOrder}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            onValuesChange={recalculateMoneyBack}
          >
            <Form.Item
              name="state"
              label="Стан книги"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="Виберіть стан(0 - не повернули, 1 - дуже погано, 10 - як нова)"
                allowClear
              >
                {new Array(11).fill(0).map((item, index) => (
                  <Option value={index} key={index}>
                    {index}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="datePicker"
              label="Сроки видачі"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Divider />
            <Typography.Text>
              Задаток: {orderToComplete?.deposit}
            </Typography.Text>
            <Divider />
            <Typography.Text>
              {moneyBack > 0 ? "До повернення клієнту:" : "До сплати:"}
              {Math.abs(moneyBack)}
            </Typography.Text>
            <Divider />
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Виконати
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Layout>
  );
};

export default React.memo(connect(null, mapDispatchToProps)(Orders));
