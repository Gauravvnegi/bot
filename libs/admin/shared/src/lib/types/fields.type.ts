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
};

export type ModalAction = {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
};

export type ModalContent = { heading: string; description: string[] };

export type UploadFileData = {
  maxFileSize: number;
  fileType: string[];
};
