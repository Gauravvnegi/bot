import { TemplateRef, Type } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
/**
 *
 * @param data require, configuration of the modal, its need service and component which you want to open inside that
 */
export function openModal(data: {
  config: ModalConfig;
  dialogService: DialogService;
  component: Type<any>;
}): DynamicDialogRef {
  return data.dialogService.open(data.component, {
    // width: '80%',
    styleClass: 'dynamic-modal',
    closable: true,
    closeOnEscape: true,
    dismissableMask: true,
    ...data.config,
  });
}

export type ModalConfig = DynamicDialogConfig & {
  styleClass?: ModalStyleClass;
};

export type ModalStyleClass =
  | 'dynamic-modal'
  | 'confirm-dialog'
  | 'no-style'
  | 'image-cropper-modal'
  | 'header-dialog';
