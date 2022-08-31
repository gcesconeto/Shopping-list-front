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
    
    if (titleValue.trim().length === 0 || 
      descValue.trim().length === 0 || 
      pplValue.trim().length === 0 ) alert('Invalid Input')
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
      console.log(title, desc, ppl);
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

const renderInput = new ProjectInput()