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
import { delay } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';
import { Observable, of, Subscription } from 'rxjs';
import { listingConfig } from '../../../constants/listing';
import { ListingService } from '../../../services/listing.service';
import { EditContactComponent } from '../../edit-contact/edit-contact.component';

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
      field: '',
      header: 'Email',
      isSort: true,
      sortType: 'number',
    },
    {
      field: '',
      header: 'Salutation',
      isSort: true,
      sortType: 'number',
    },
    {
      field: ``,
      header: 'First Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: ``,
      header: 'Last Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: ``,
      header: 'Company Name',
      isSort: true,
      sortType: 'string',
    },
    {
      field: ``,
      header: 'Mobile',
      isSort: true,
      sortType: 'string',
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
    const ids = this.selectedRows.map((item) => ({ id: item.id }));
    if (this.add) {
      this.dataSource = this.dataSource.filter(
        (data) => !ids.some((el) => el.id === data.id)
      );
      this.updateContacts.emit({ add: true, data: this.dataSource });
      this.totalRecords = this.dataSource.length;
    } else {
      this.$subscription.add(
        this._listingService
          .deleteContact(
            this.hotelId,
            this._adminUtilityService.makeQueryParams(ids)
          )
          .subscribe(
            (response) =>
              this._snackbarService.openSnackBarAsText('Contact deleted', '', {
                panelClass: 'success',
              }),
            ({ error }) =>
              this._snackbarService.openSnackBarAsText(error.message)
          )
      );
    }
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

    editContactCompRef.componentInstance.contacts = this.dataSource;
    if (!this.add) editContactCompRef.componentInstance.listId = this.listId;
    editContactCompRef.componentInstance.onContactClosed.subscribe(
      (response) => {
        if (response.status) {
          this.dataSource = response.data;
          this.changePage(this.currentPage);
          this.updateContacts.emit({ add: true, data: this.dataSource });
        }
        editContactCompRef.close();
      }
    );
  }

  get listingConfiguration() {
    return listingConfig;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
