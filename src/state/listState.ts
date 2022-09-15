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
    const newProject = new Item(
      Math.random().toString(),
      itemName,
      1,
      'active'
    )
    this.items.push(newProject);
    this.updateListeners();
  }

  increaseItemQty(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.qty += 1;
      this.updateListeners();
    }
  }

  decreaseItemQty(id: string) {
    const item = this.items.find((item) => item.id === id);
    if (item && item.qty > 1) {
      item.qty -= 1;
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