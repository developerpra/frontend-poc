import { db, Order } from "./dexieClient";

export const OrdersRepository = {
  async add(order: any) {
    return await db.orders.add({
      data: order,
      synced: false,
    });
  },

  async getUnsynced() {
    return await db.orders.where("synced").equals(false).toArray();
  },

  async markSynced(id: number) {
    return await db.orders.update(id, { synced: true });
  },

  async getAll() {
    return await db.orders.toArray();
  },
};
