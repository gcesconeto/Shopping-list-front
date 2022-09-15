import { Component } from './baseComponent';
import { Item } from '../models/types';
import { state } from "../app";
import { Autobind } from '../decorators/autobinder';

// Project component class
export class ListItem extends Component<HTMLUListElement, HTMLLIElement> {
  private item: Item;
  private hostId: string;

  get qty() {
    if (this.item.qty > 1) return `x${this.item.qty}`
    else return ''
  }

  constructor(hostId: string, item: Item) {
    super('single-item', hostId, false, item.id);
    this.item = item;
    this.hostId = hostId;
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

  attachButtons () {
    const incButton = document.createElement("button");
    const decButton = document.createElement("button");
    incButton.addEventListener('click', this.increaseQtyHandler);
    decButton.addEventListener('click', this.decreaseQtyHandler);
    incButton.innerHTML = '+';
    if (this.item.qty < 2) decButton.innerHTML = 'Remove'
    else decButton.innerHTML = '-'
    this.element.appendChild(incButton);
    this.element.appendChild(decButton);
  } 

  configure() {
    if (this.hostId === 'active-list') {
      console.log('entrou no if');
      this.attachButtons();
    }
  }

  render() {
    this.element.querySelector('h2')!.textContent = this.item.itemName;
    this.element.querySelector('h3')!.textContent = this.qty;
  }
}
