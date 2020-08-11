export class InputDetails {
  value: string;
  key: string;
  label: string;
  master_label?: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  style: string;
  disable?: boolean;
  appearance?: string;
  icon?: string;
  maskPattern?;
  options?: { key: string; value: string }[];
}
