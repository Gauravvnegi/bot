import { TableObjectStyleKeys } from '../constants/table-view.const';

type TextType =
  | 'primary-text'
  | 'warning-text'
  | 'danger-text'
  | 'completed-text'
  | 'tiny-text';
type ItemValue = { label: string; value: string };

interface DropDownItem {
  currentState: string;
  nextStates: string[];
  items?: ItemValue[];
}

export interface TableObjectData {
  [key: string]: string | number | boolean;
  [TableObjectStyleKeys.icon]?: string;
  [TableObjectStyleKeys.styleClass]?: 'active-text' | string;
  [TableObjectStyleKeys.textInlineBlock]?: boolean;
  [TableObjectStyleKeys.textSeparator]?: string;
  [TableObjectStyleKeys.preText]?: TextType;
  [TableObjectStyleKeys.postText]?: TextType;
}

export interface ActionDataType {
  dropDown?: DropDownItem;
  quick?: ItemValue[];
}

export interface TableViewDataType {
  [key: string]: string | TableObjectData | ActionDataType;
  action?: ActionDataType;
}
