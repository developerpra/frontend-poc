import { OrdersRepository } from "../../../services/db/ordersRepository";

const createOrder = async () => {
  const orderData = {
    id: Date.now(),
    item: "Laptop",
    qty: 2,
  };

  await OrdersRepository.add(orderData);

  alert("Order stored offline!");
};
