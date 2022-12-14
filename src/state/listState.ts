import { Listener, Item } from '../models/types';

// Generic State class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(newListener: Listener<T>) {
    this.listeners.push(newListener);
  }
}

// State handling class
export class ListState extends State<Item> {
  private items: Item[] = [];
  private static instance: ListState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
    else {
      this.instance = new ListState();
      return this.instance;
    }
  }

  addItem(itemName: string) {
    const newItem = new Item(
      Math.random().toString(),
      itemName,
      1,
      'active'
    )
    this.items.push(newItem);
    this.updateListeners();
  }

  increaseItemQty(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.qty += 1;
      this.updateListeners();
    }
  }

  toggleStatus(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item && item.status === 'active') {
      item.status = 'pool';
      this.updateListeners();
    } else if (item && item.status === 'pool') {
      item.status = 'active';
      this.updateListeners();
    }
  }

  decreaseItemQty(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item && item.qty > 1) {
      item.qty -= 1;
      this.updateListeners();
    } else if (item && item.qty === 1) {
      this.toggleStatus(id);
      this.updateListeners();
    }
  }

  removeItem(id: string) {
    this.items.filter((item) => item.id !== id);
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener(this.items.slice());
    }
  }
}