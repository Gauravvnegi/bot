import { ButtonVariant, Option } from './form.type';

export type IteratorField = {
  label: string;
  name: string;
  type: 'input' | 'select';
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
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
