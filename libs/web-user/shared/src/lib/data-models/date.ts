export class DateDetails {
  value: string;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  style: string;
  disable?: boolean;
  options?: { key: string; value: string }[];
  appearance?: string;
}
