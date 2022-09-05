// Types
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export type Listener<T> = (items: T[]) => void;

export type Status = 'active' | 'finished';

export class Project {
  constructor(
    public id: string, 
    public title: string, 
    public desc: string, 
    public ppl: number,
    public status: Status
  ) {}
}
