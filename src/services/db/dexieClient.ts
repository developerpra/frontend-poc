import Dexie, { Table } from "dexie";

export interface Order {
  id?: number; // Auto-increment
  data: any; // Your payload
  synced: boolean; // Whether sent to server or not
}

export class AppDB extends Dexie {
  orders!: Table<Order, number>;

  constructor() {
    super("MyAppDatabase");

    this.version(1).stores({
      orders: "++id, synced",
    });
  }
}

export const db = new AppDB();
