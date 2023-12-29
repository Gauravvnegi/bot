import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
/**
 *
 * @param data require, configuration of the modal, its need service and component which you want to open inside that
 */
export function openModal(data: {
  config: DynamicDialogConfig;
  dialogService: DialogService;
  component: any;
}) {
  data.dialogService.open(data.component, {
    width: '80%',
    styleClass: 'dynamic-modal',
    closable: true,
    closeOnEscape: true,
    dismissableMask: true,
    ...data.config,
  });
}
