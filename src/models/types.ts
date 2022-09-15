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

export type Status = 'pool' | 'active';

export class Item {
  constructor(
    public id: string, 
    public itemName: string, 
    public qty: number,
    public status: Status,
  ) {}
}
