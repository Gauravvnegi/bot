import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';

export type ActionConfigType =
  | Pick<FormActionConfig, 'preLabel' | 'postLabel' | 'preSeverity'>
  | Record<string, string | boolean>;
