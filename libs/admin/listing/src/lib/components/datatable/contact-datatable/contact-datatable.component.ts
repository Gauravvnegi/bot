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
import { SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { listingConfig } from '../../../constants/listing';
import { Contact } from '../../../data-models/listing.model';
import { ListingService } from '../../../services/listing.service';
import { EditContactComponent } from '../../edit-contact/edit-contact.component';
import { ImportContactComponent } from '../../import-contact/import-contact.component';

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
  @Input() listId: string;
  tableName: string = 'Manage Contacts';
  cols = [
    {
      field: 'email',
      header: 'Email',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'salutation',
      header: 'Salutation',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'firstName',
      header: 'First Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'lastName',
      header: 'Last Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'companyName',
      header: 'Company Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'mobile',
      header: 'Mobile',
      isSort: true,
      sortType: 'number',
    },
  ];
  $subscription = new Subscription();
  globalQueries = [];
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    protected _adminUtilityService: AdminUtilityService,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
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
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add();
  }

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
              this._snackbarService.openSnackBarAsText('Contact deleted', '', {
                panelClass: 'success',
              });
              this.updateDataSourceAfterDelete(ids);
            },
            ({ error }) =>
              this._snackbarService.openSnackBarAsText(error.message)
          )
      );
    } else this.updateDataSourceAfterDelete(ids, this.selectedRows);
  }

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
                .updateListContact(this.hotelId, this.listId, response.data)
                .subscribe(
                  (response) => {
                    this.handleContactAddEvent(response);
                  },
                  ({ error }) =>
                    this._snackbarService.openSnackBarAsText(error.message)
                )
            );
          } else this.handleContactAddEvent(response.data);
        }
        editContactCompRef.close();
      }
    );
  }

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
          .updateListContact(this.hotelId, this.listId, reqData)
          .subscribe(
            (response) => {
              this.dataSource = [...this.dataSource, ...data];
              this.changePage(this.currentPage);
              this.updateContacts.emit();
            },
            ({ error }) =>
              this._snackbarService.openSnackBarAsText(error.message)
          )
      );
    }
  }

  get listingConfiguration() {
    return listingConfig;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
