import { Component } from "./baseComponent";
import { validate } from "../util/validation";
import { Autobind } from "../decorators/autobinder";
import { state } from "../app";

// Input component class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  pplInput: HTMLInputElement;
  
  constructor() {
    super('project-input', 'app', true, 'user-input');
    
    this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.descInput = this.element.querySelector('#description') as HTMLInputElement;
    this.pplInput = this.element.querySelector('#people') as HTMLInputElement;
    
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.handleSubmit);
  }

  render() {};
  
  private gatherUSerInput(): [string, string, number] | void {
    const titleValue = this.titleInput.value;
    const descValue = this.descInput.value;
    const pplValue = this.pplInput.value;
    
    if (
      !validate({ value: titleValue, required: true, minLength: 3 }) ||
      !validate({ value: descValue, required: true, minLength: 6 }) ||
      !validate({ value: +pplValue, required: true, min: 1, max: 6 })
      ) alert('Invalid Input')
      else return [titleValue, descValue, +pplValue];
    }
    
  private clearInputs() {
    this.titleInput.value = '';
    this.descInput.value = '';
    this.pplInput.value = '';
  }
  
  @Autobind
  private handleSubmit(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUSerInput();
    if (Array.isArray(userInput)) {
      const [title, desc, ppl] = userInput;
      state.addProject(title, desc, ppl);
      this.clearInputs();
    }
  }
}