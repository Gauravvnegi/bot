import { FieldSchema } from './fieldSchema.model';

export interface CakeConfigI {
    date: FieldSchema;
    expectedTime: FieldSchema;
    message: FieldSchema;
    flavour: FieldSchema;
    quantity: FieldSchema;
    removeButton: FieldSchema;
  }