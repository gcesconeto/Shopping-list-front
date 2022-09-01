// Types
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

type Listener<T> = (items: T[]) => void;

class Project {
  constructor(
    public id: string, 
    public title: string, 
    public desc: string, 
    public ppl: number,
    public status: 'active' | 'finished'
  ) {}
}
// Validation logic
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

// Generic component class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostId: string, attachAtStart: boolean, newId?: string, ) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;

    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as U;
    if (newId) this.element.id = newId;

    this.attach(attachAtStart);
  }

  private attach(attachAtStart: boolean) {
    this.hostElement.insertAdjacentElement(attachAtStart ? 'afterbegin' : 'beforeend', this.element)
  }

  abstract configure(): void;

  abstract render(): void;
}

// Generic State class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(newListener: Listener<T>) {
    this.listeners.push(newListener);
  }
}
// State handling class
class ProjectState extends State<Project> {
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
    else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProject(title: string, desc: string, ppl: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      ppl,
      'active',
    )
    this.projects.push(newProject);
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

// Input component class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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

// Project component class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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

  configure() {}
  render() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.ppl + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.desc;
  }
}

// List component class
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
  assignedProjects: Project[];
  
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    
    this.configure();
    this.render();
  }
  
  configure() {
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
const state = ProjectState.getInstance();

const renderInput = new ProjectInput()

const renderActiveList = new ProjectList('active')

const renderFinishedList = new ProjectList('finished')