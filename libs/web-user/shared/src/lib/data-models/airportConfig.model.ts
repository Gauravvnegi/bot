import { FieldSchema } from './fieldSchema.model';

export interface AirportConfigI {
    airportName: FieldSchema;
    terminal: FieldSchema;
    flightNumber: FieldSchema;
    pickupTime: FieldSchema;
    quantity: FieldSchema;
    removeButton: FieldSchema;
  }
  