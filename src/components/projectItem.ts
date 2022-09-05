import { Draggable } from '../models/dragDropInterfaces.js'
import { Component } from './baseComponent.js';
import { Project } from '../models/types.js';
import { Autobind } from '../decorators/autobinder.js';

// Project component class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get ppl() {
    return this.project.ppl < 2 ? '1 person' : `${this.project.ppl} persons`
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.render();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(_event: DragEvent) {
      // console.log('Drag ended');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  render() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.ppl + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.desc;
  }
}
