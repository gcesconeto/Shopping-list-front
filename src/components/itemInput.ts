import { Component } from "./baseComponent";
import { validate } from "../util/validation";
import { Autobind } from "../decorators/autobinder";
import { state } from "../app";

// Input component class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  itemName: HTMLInputElement;
  
  constructor() {
    super('item-input', 'app', true, 'user-input');
    
    this.itemName = this.element.querySelector('#name') as HTMLInputElement;
    
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }

  render() {};
  
  private gatherUSerInput(): [string] | void {
    const itemName = this.itemName.value;
    if (
      !validate({ value: itemName, required: true, minLength: 3 })
      ) alert('Invalid Input')
      else return [itemName];
    }
    
  private clearInputs() {
    this.itemName.value = '';
  }
  
  @Autobind
  private handleSubmit(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUSerInput();
    if (Array.isArray(userInput)) {
      const [itemName] = userInput;
      state.addItem(itemName);
      this.clearInputs();
    }
  }
}