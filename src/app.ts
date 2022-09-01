// Validation logic
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

// Autobind Decorator
function Autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjustedDescriptor;
}

// State handling class
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

  static getInstance() {
    if (this.instance) return this.instance;
    else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addListener(newListener: Function) {
    this.listeners.push(newListener);
  }

  addProject(title: string, desc: string, people: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      desc,
      people,
    }
    this.projects.push(newProject);
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

const state = ProjectState.getInstance();

// Input handling class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInput: HTMLInputElement;
  descInput: HTMLInputElement;
  pplInput: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInput = this.element.querySelector('#title') as HTMLInputElement;
    this.descInput = this.element.querySelector('#description') as HTMLInputElement;
    this.pplInput = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUSerInput(): [string, string, number] | void {
    const titleValue = this.titleInput.value;
    const descValue = this.descInput.value;
    const pplValue = this.pplInput.value;
    
    if (
      !validate({ value: titleValue, required: true, minLength: 3 }) ||
      !validate({ value: descValue, required: true, minLength: 6 }) ||
      !validate({ value: +pplValue, required: true, min: 2, max: 6 })
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

  private configure() {
    this.element.addEventListener('submit', this.handleSubmit)
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

// List handling class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];
  
  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];
    
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    state.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
    this.attach();
    this.fillContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const project of this.assignedProjects) {
      console.log(project);
      const projectEl = document.createElement('li')
      projectEl.textContent = project.title;
      listEl.appendChild(projectEl);
    }
  }

  private fillContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }
  
  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element)
  }
}

const renderInput = new ProjectInput()

const renderActiveList = new ProjectList('active')

const renderFinishedList = new ProjectList('finished')