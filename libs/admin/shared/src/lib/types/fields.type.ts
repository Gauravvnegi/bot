import { Validator, ValidatorFn } from '@angular/forms';
import { ButtonVariant, InputType, Option } from './form.type';

export type IteratorField = {
  label?: string;
  name: string;
  type: 'input' | 'select' | 'multi-select' | 'auto-complete' | 'quick-select';
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  isAsync?: boolean;
  loadMoreResults?: () => void;
  searchResults?: (event: string) => void;
  create?: () => void;
  loading?: boolean | boolean[];
  noMoreResults?: boolean;
  dataType?: InputType;
  minValue?: number;
  createPrompt?: string;
  validators?: ValidatorFn[];
  errorMessages?: {};
};

export type ModalAction = {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
};

export type ModalContent = {
  heading: string;
  description: string[];
  isRemarks?: boolean;
};

export type UploadFileData = {
  maxFileSize: number;
  fileType: string[];
};

export type FieldValues = Record<string, any>;
export type NewDataRecord<TData, TValue = any> = Record<keyof TData, TValue>;
