export type InputVariant = 'standard' | 'outlined';
export type Alignment = 'vertical' | 'horizontal';

export type FormProps = {
  isSearch?: boolean;
  float?: boolean;
  variant?: InputVariant;
  alignment?: Alignment;
  showClear?: boolean;
  errorMessages?: Record<string, string>;
  height?: string;
  width?: string;
  fontSize?: string;
};
