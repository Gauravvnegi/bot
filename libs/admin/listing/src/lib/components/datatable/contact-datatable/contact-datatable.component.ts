import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  sharedConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
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

@Component({
  selector: 'hospitality-bot-contact-datatable',
  templateUrl: './contact-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './contact-datatable.component.scss',
  ],
})
export class ContactDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  isTabFilters: boolean = false;
  tabFilterItems = [];
  @Input() dataSource = [];
  @Input() totalRecords: number = 0;
  @Input() add: boolean = true;
  @Input() hotelId: string;
  @Output() updateContacts = new EventEmitter();
  @Input() list: List;
  tableName: string = 'Manage Contacts';
  cols = contactConfig.datatable.cols;
  $subscription = new Subscription();
  globalQueries = [];
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    protected _adminUtilityService: AdminUtilityService,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    private _modal: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.loadInitialData();
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
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    let field =
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
        .exportContact(this.hotelId, this.list.id, config)
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
            this._snackbarService.openSnackBarWithTranslate(
              {
                translateKey: 'message.error.exportCSV_fail',
                priorityMessage: error.message,
              },
              ''
            )
            .subscribe();
          }
        )
    );
  }

  /**
   * @function deleteContact to delete contact form a record.
   */
  deleteContact() {
    const ids = this.selectedRows.map((item) => ({ contact_id: item.id }));
    if (!this.add) {
      this.$subscription.add(
        this._listingService
          .deleteContact(
            this.hotelId,
            this._adminUtilityService.makeQueryParams(ids)
          )
          .subscribe(
            (response) => {
              this._snackbarService.openSnackBarWithTranslate(
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
            ({ error }) =>{
              this._snackbarService.openSnackBarWithTranslate(
                {
                  translateKey: 'message.error.contact_not_delete',
                  priorityMessage: error.message,
                },
                ''
              )
              .subscribe();
            }
          )
      );
    } else this.updateDataSourceAfterDelete(ids, this.selectedRows);
  }

  /**
   * @function updateDataSourceAfterDelete to update data source after delete a record.
   * @param ids id for which delete action will be done.
   * @param selectedRows selected row for which delete action will be done.
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
   * @function openAddContact opens add contact page.
   * @param event event for which add contact action will be done.
   */
  openAddContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const editContactCompRef = this._modal.openDialog(
      EditContactComponent,
      dialogConfig
    );

    if (this.add)
      editContactCompRef.componentInstance.contacts = this.dataSource;
    editContactCompRef.componentInstance.onContactClosed.subscribe(
      (response) => {
        if (response.status) {
          if (!this.add) {
            this.$subscription.add(
              this._listingService
                .updateListContact(this.hotelId, this.list.id, response.data)
                .subscribe(
                  (response) => {
                    this.handleContactAddEvent(response);
                  },
                  ({ error }) =>{
                    this._snackbarService.openSnackBarWithTranslate(
                      {
                        translateKey: 'message.error.contact_not_add',
                        priorityMessage: error.message,
                      },
                      ''
                    )
                    .subscribe();
                  }
                )
            );
          } else this.handleContactAddEvent(response.data);
        }
        editContactCompRef.close();
      }
    );
  }

  /**
   * @function handleContactAddEvent handles contact add event.
   * @param data the data of a record for which add contact event will be done. 
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
   * @function openImportContact opens contacts to import.
   * @param event event for which import action will be done.
   */
  openImportContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    const importCompRef = this._modal.openDialog(
      ImportContactComponent,
      dialogConfig
    );

    importCompRef.componentInstance.hotelId = this.hotelId;
    importCompRef.componentInstance.onImportClosed.subscribe((response) => {
      if (response.status) {
        this.handleContactImport(response.data);
      }
      importCompRef.close();
    });
  }

  /**
   * @function handleContactImport handles contact import.
   * @param data the data for which handleContactImport will be done.
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
          .updateListContact(this.hotelId, this.list.id, reqData)
          .subscribe(
            (response) => {
              this.dataSource = [...this.dataSource, ...data];
              this.changePage(this.currentPage);
              this.updateContacts.emit();
            },
            ({ error }) =>
              {
                this._snackbarService.openSnackBarWithTranslate(
                  {
                    translateKey: 'message.error.contact_not_import',
                    priorityMessage: error.message,
                  },
                  ''
                )
                .subscribe();
              }
          )
      );
    }
  }

  /**
   * @function listingConfiguration returns listingConfig object.
   * @returns listingConfig object.
   */
  get listingConfiguration() {
    return listingConfig;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
