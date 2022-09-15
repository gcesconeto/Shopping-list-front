import { Component } from './baseComponent';
import { Item } from '../models/types';
import { state } from "../app.js";
import { Autobind } from '../decorators/autobinder.js';

// Project component class
export class ListItem extends Component<HTMLUListElement, HTMLLIElement> {
  private item: Item;

  get qty() {
    if (this.item.qty > 1) return `x${this.item.qty}`
    else return ''
  }

  constructor(hostId: string, item: Item) {
    super('single-item', hostId, false, item.id);
    this.item = item;

    this.configure();
    this.render();
  }

  @Autobind
  increaseQtyHandler ( _event: Event ) {
    state.increaseItemQty(this.item.id)
  }

  @Autobind
  decreaseQtyHandler ( _event: Event ) {
    state.decreaseItemQty(this.item.id)
  }


  configure() {

  }

  render() {
    this.element.querySelector('h2')!.textContent = this.item.itemName;
  }
}
