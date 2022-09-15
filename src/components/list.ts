import { state } from "../app";
import { Item, Status } from "../models/types";
import { Component } from "./baseComponent";
import { ListItem } from "./listItem";

// List component class
export class List extends Component<HTMLDivElement, HTMLElement>{
  assignedItems: Item[];
  
  constructor(private type: Status) {
    super('list', 'app', false, `${type}-items`);
    this.assignedItems = [];
    
    this.configure();
    this.render();
  }

  configure() {
    state.addListener((projects: Item[]) => {
      this.assignedItems = projects.filter((project) => project.status === this.type);
      this.renderProjects();
    });
  }

  render() {
    const listId = `${this.type}-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = 'List';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const item of this.assignedItems) {
      new ListItem(this.element.querySelector('ul')!.id, item);
    }
  }
}