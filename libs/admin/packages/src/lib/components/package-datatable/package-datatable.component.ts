import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { Packages } from '../../data-models/packageConfig.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'hospitality-bot-package-datatable',
  templateUrl: './package-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './package-datatable.component.scss',
  ],
})
export class PackageDatatableComponent extends BaseDatatableComponent {
  tableName = 'Packages';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;
  globalQueries = [];
  tabFilterIdx: number = 1;
  $subscription = new Subscription();
  hotelId;

  cols = [
    { field: 'name', header: 'Package Name', sortType: 'string', isSort: true },
    {
      field: 'packageCode',
      header: 'Package Code/Source',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'description',
      header: 'Description',
      sortType: 'string',
      isSort: true,
    },
    { field: 'type', header: 'Type', sortType: 'string', isSort: true },
    { field: 'rate', header: 'Amount', sortType: 'string', isSort: true },
    { field: 'status', header: 'Active', isSort: false },
  ];

  constructor(
    public fb: FormBuilder,
    private packageService: PackageService,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      //fetch-api for records
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: 'DESC',
        },
      ]);
    });
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new Packages().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.packageService.getHotelPackages(config);
  }

  loadData(event: LazyLoadEvent): void {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: 'DESC',
          },
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        }
      ).subscribe(
        (data) => {
          this.values = new Packages().deserialize(data).records;

          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  customSort(event: SortEvent) {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    let field =
      col.sortType === 'string' && event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.packageService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            this.tableName.toLowerCase() +
              '_export_' +
              new Date().getTime() +
              '.csv'
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  updatePackageStatus(event, packageId): void {
    let packages = [];
    packages.push(packageId);
    this.packageService
      .updatePackageStatus(this.hotelId, event.checked, packages)
      .subscribe(
        (response) => {
          this.snackbarService.openSnackBarAsText(
            'Status updated successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        }
      );
  }

  redirectToAddPackage(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  openPackageDetails(amenity): void {
    this.router.navigate([`edit/${amenity.id}`], { relativeTo: this.route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith'): void {
    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }
}
