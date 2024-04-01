import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  openModal,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { contactConfig } from '../../../constants/contact';
import { listingConfig } from '../../../constants/listing';
import { Contact, List } from '../../../data-models/listing.model';
import { ListingService } from '../../../services/listing.service';
import { EditContactComponent } from '../../edit-contact/edit-contact.component';
import { ImportContactComponent } from '../../import-contact/import-contact.component';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

@Component({
  selector: 'hospitality-bot-contact-datatable',
  templateUrl: './contact-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './contact-datatable.component.scss',
  ],
})
export class ContactDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  isTabFilters = false;
  tabFilterItems = [];
  @Input() dataSource = [];
  @Input() totalRecords = 0;
  @Input() add = true;
  @Input() entityId: string;
  @Output() updateContacts = new EventEmitter();
  @Input() list: List;
  tableName = contactConfig.datatable.title;
  cols = contactConfig.datatable.cols;
  $subscription = new Subscription();
  globalQueries = [];
  constructor(
    public fb: FormBuilder,
    protected _adminUtilityService: AdminUtilityService,
    private _listingService: ListingService,
    private snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    private dialogService: DialogService,
    private globalFilterService: GlobalFilterService,
    private routeConfigService: RoutesConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.entityId = this.globalFilterService.entityId;
  }

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    this.tempFirst = this.first;
    this.tempRowsPerPage = this.rowsPerPage;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param event The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
   */
  onFilterTypeTextChange(
    value: string,
    field: string,
    matchMode = 'startsWith'
  ): void {
    if (!!value && !this.isSearchSet) {
      this.tempFirst = this.first;
      this.tempRowsPerPage = this.rowsPerPage;
      this.isSearchSet = true;
    } else if (!!!value) {
      this.isSearchSet = false;
      this.first = this.tempFirst;
      this.rowsPerPage = this.tempRowsPerPage;
    }

    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this._listingService
        .exportContact(this.entityId, this.list.id, config)
        .subscribe(
          (response) => {
            FileSaver.saveAs(
              response,
              `${this.list.name.toLowerCase()}_contacts_export_${new Date().getTime()}.csv`
            );
            this.loading = false;
          },
          ({ error }) => {
            this.loading = false;
          }
        )
    );
  }

  /**
   * @function deleteContact To delete marketing contact fields value from record.
   */
  deleteContact() {
    let description = [`Are you sure you want to delete the contact?`];

    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ModalComponent> = {
      heading: `Delete Contact`,
      descriptions: description,
      actions: [
        {
          label: 'Cancel',
          onClick: () => {
            dialogRef.close();
          },
          variant: 'outlined',
        },
        {
          label: 'Delete',
          onClick: () => {
            this.onDeleteContact();
            dialogRef.close();
          },
          variant: 'contained',
        },
      ],
    };

    dialogRef = openModal({
      config: {
        styleClass: 'confirm-dialog',
        data: modalData,
      },
      dialogService: this.dialogService,
      component: ModalComponent,
    });
  }

  onDeleteContact() {
    const ids = this.selectedRows.map((item) => ({ contact_id: item.id }));
    if (!this.add) {
      this.$subscription.add(
        this._listingService
          .deleteContact(
            this.entityId,
            this._adminUtilityService.makeQueryParams(ids)
          )
          .subscribe(
            (response) => {
              this.snackbarService
                .openSnackBarWithTranslate(
                  {
                    translateKey: 'message.success.contact_delete',
                    priorityMessage: 'Contact deleted',
                  },
                  '',
                  {
                    panelClass: 'success',
                  }
                )
                .subscribe();
              this.updateDataSourceAfterDelete(ids);
            },
            ({ error }) => {}
          )
      );
    } else this.updateDataSourceAfterDelete(ids, this.selectedRows);
  }

  /**
   * @function updateDataSourceAfterDelete To update contact data table after deleting a marketing contact field's value from record.
   * @param ids Contact field is deleted of the respective ids.
   * @param selectedRows Contact field is deleted from the selected rows.
   */
  updateDataSourceAfterDelete(ids, selectedRows = []) {
    if (selectedRows.length)
      this.dataSource = this.dataSource.filter(
        (data) => !selectedRows.some((el) => el.email === data.email)
      );
    else
      this.dataSource = this.dataSource.filter(
        (data) => !ids.some((el) => el.contact_id === data.id)
      );
    this.selectedRows = [];
    this.updateContacts.emit({ add: true, data: this.dataSource });
    this.totalRecords = this.dataSource.length;
    this.changePage(this.currentPage);
  }

  /**
   * @function openAddContact To open add contacts page.
   * @param event The event to stop propagation of the same event from being called.
   */
  openAddContact(isEdit: boolean = false) {
    let dialogRef: DynamicDialogRef;

    const addModalData: Partial<EditContactComponent> = {
      ...(this.add && { contacts: this.dataSource }),
    };

    const editModalData: Partial<EditContactComponent> = {
      contactList: this.selectedRows,
      tableName: 'Edit Contact',
    };

    dialogRef = openModal({
      config: {
        styleClass: 'confirm-dialog',
        data: isEdit ? editModalData : addModalData,
        width: '90em',
      },
      component: EditContactComponent,
      dialogService: this.dialogService,
    });

    dialogRef.onClose.subscribe((response) => {
      if (response.status) {
        if (!this.add) {
          if (isEdit) {
            this.$subscription.add(
              this._listingService
                .updateContact(this.entityId, this.list.id, response.data)
                .subscribe(
                  (response) => {
                    this.snackbarService.openSnackBarAsText(
                      'Contact Updated successfully',
                      '',
                      { panelClass: 'success' }
                    );

                    this.routeConfigService.reload();
                  },
                  ({ error }) => {}
                )
            );
          } else {
            this.$subscription.add(
              this._listingService
                .updateListContact(this.entityId, this.list.id, response.data)
                .subscribe(
                  (response) => {
                    this.handleContactAddEvent(response);
                  },
                  ({ error }) => {}
                )
            );
          }
        } else this.handleContactAddEvent(response.data);
      }
    });
  }

  /**
   * @function handleContactAddEvent To add new contact to record.
   * @param data The data of a record for which this action will be done.
   */
  handleContactAddEvent(data) {
    data.forEach((item) =>
      this.dataSource.push(new Contact().deserialize(item, 0))
    );
    this.totalRecords = this.dataSource.length + 1;
    this.changePage(this.currentPage);
    if (this.add) {
      this.updateContacts.emit({
        add: true,
        data: this.dataSource,
      });
    } else {
      this.updateContacts.emit();
    }
  }

  /**
   * @function openImportContact To open contacts list to import.
   * @param event The event to stop propagation of the same event from being called.
   */
  openImportContact(event) {
    event.stopPropagation();
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ImportContactComponent> = {
      entityId: this.entityId,
    };
    dialogRef = openModal({
      config: {
        styleClass: 'confirm-dialog',
        data: modalData,
      },
      component: ImportContactComponent,
      dialogService: this.dialogService,
    });
    dialogRef.onClose.subscribe((response) => {
      if (response.status) this.handleContactImport(response.data);
    });
  }

  /**
   * @function handleContactImport To handle import of new contact field.
   * @param data The data for which handleContactImport will be done.
   */
  handleContactImport(data) {
    if (this.add) {
      this.dataSource = [...this.dataSource, ...data];
      this.totalRecords = this.dataSource.length;
      this.updateContacts.emit({
        add: true,
        data: this.dataSource,
      });
      this.changePage(this.currentPage);
    } else {
      const reqData = [];
      data.forEach((item) => {
        const {
          firstName,
          lastName,
          salutation,
          companyName,
          mobile,
          email,
        } = item;
        reqData.push({
          firstName,
          lastName,
          salutation,
          companyName,
          mobile,
          email,
        });
      });
      this.$subscription.add(
        this._listingService
          .updateListContact(this.entityId, this.list.id, reqData)
          .subscribe(
            (response) => {
              this.dataSource = [...this.dataSource, ...data];
              this.changePage(this.currentPage);
              this.updateContacts.emit();
            },
            ({ error }) => {}
          )
      );
    }
  }

  /**
   * @function listingConfiguration To return listingConfig object.
   * @returns ListingConfig object.
   */
  get listingConfiguration() {
    return listingConfig;
  }

  /**
   * @function ngOnDestroy To unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
