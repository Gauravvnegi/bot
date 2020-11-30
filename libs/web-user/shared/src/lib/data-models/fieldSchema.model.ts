import * as _ from 'lodash';

export interface Deserializable {
  deserialize(input: any): this;
}

export class FieldSchema implements Deserializable {
  label?: string;
  disable?: boolean;
  isDatePickerDisable: boolean;
  checked?: boolean;
  align?: boolean;
  master_label?: string;
  placeholder?: string;
  value?: string;
  key?: string;
  required?: boolean;
  type: string;
  contentType?: string;
  floatLabel?: string;
  style?: {
    fieldSetWrapperStyles: '';
    labelWrapperStyles: '';
    detailLabelStyles: '';
    childLabelStyles: '';
    detailValueStyles: '';
    detailWrapperStyles: '';
    detailPrefixIconStyles: '';
    detailMatIconStyles: '';
  };
  mediaQuery?;
  icon?: string;
  url?: string;
  isUploading?: boolean;
  appearance?: string;
  maskPattern?;
  options?: { key: string; value: string }[];
  optionsClosed?: { key: string; value: string }[];
  optionsOpened?: { key: string; value: string }[];
  isOptionsOpenedChanged?: boolean;
  translation?: {
    label?: '';
  };

  deserialize(input: any) {
    Object.assign(
      this,
      _.set({}, 'label', _.get(input, ['label'])),
      _.set({}, 'disable', _.get(input, ['disable'])),
      _.set({}, 'isDatePickerDisable', _.get(input, ['isDatePickerDisable'])),
      _.set({}, 'master_label', _.get(input, ['master_label'])),
      _.set({}, 'value', _.get(input, ['value'])),
      _.set({}, 'key', _.get(input, ['key'])),
      _.set({}, 'required', _.get(input, ['required'])),
      _.set({}, 'type', _.get(input, ['type'])),
      _.set({}, 'contentType', _.get(input, ['contentType'])),
      _.set({}, 'icon', _.get(input, ['icon'])),
      _.set({}, 'appearance', _.get(input, ['appearance'])),
      _.set({}, 'maskPattern', _.get(input, ['maskPattern'], false)),
      _.set({}, 'options', _.get(input, ['options'])),
      _.set({}, 'placeholder', _.get(input, ['placeholder'])),
      _.set({}, 'isUploading', _.get(input, ['isUploading'])),
      _.set({}, 'style', _.get(input, ['style'])),
      _.set({}, 'translation', _.get(input, ['translation'])),
      _.set({}, 'floatLabel', _.get(input, ['floatLabel'])),
      _.set(
        {},
        'isOptionsOpenedChanged',
        _.get(input, ['isOptionsOpenedChanged'])
      ),
      _.set({}, 'optionsClosed', _.get(input, ['optionsClosed'])),
      _.set({}, 'optionsOpened', _.get(input, ['optionsOpened']))
    );
    return this;
  }
}
