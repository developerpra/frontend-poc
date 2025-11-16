import { OrdersRepository } from "../../../services/db/ordersRepository";
import { api } from "../../../services/api/apiWrapper";
import { API_ENDPOINTS } from "../../../services/api/apiEndpoints";

export async function syncOrdersToServer() {
  const unsynced = await OrdersRepository.getUnsynced();

  for (const order of unsynced) {
    try {
      await api.post(API_ENDPOINTS.ORDERS, order.data);
      await OrdersRepository.markSynced(order.id!);
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }
}
