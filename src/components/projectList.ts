import { Autobind } from "../decorators/autobinder";
import { state } from "../app";
import { Project, Status } from "../models/types";
import { Component } from "./baseComponent";
import { ProjectItem } from "./projectItem";
import { DragTarget } from "../models/dragDropInterfaces";

// List component class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  assignedProjects: Project[];
  
  constructor(private type: Status) {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    
    this.configure();
    this.render();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const id = event.dataTransfer!.getData('text/plain');
    state.moveProject(id, this.type);
  }

  @Autobind
  dragLeaveHandler(_event: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    state.addListener((projects: Project[]) => {
      this.assignedProjects = projects.filter((project) => project.status === this.type);
      this.renderProjects();
    });
  }

  render() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }
}