import { Listener, Status, Project } from '../models/types.js';

// Generic State class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(newListener: Listener<T>) {
    this.listeners.push(newListener);
  }
}

// State handling class
export class ProjectState extends State<Project> {
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
    this.updateListeners();
  }

  moveProject(id: string, newStatus: Status) {
    const project = this.projects.find((project) => project.id === id);
    if (project && project.status !== newStatus) {
      project.status = newStatus 
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}