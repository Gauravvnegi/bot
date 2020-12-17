import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Packages } from '../../data-models/packageConfig.model';
import { PackageService } from '../../services/package.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';

@Component({
  selector: 'hospitality-bot-package-datatable',
  templateUrl: './package-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './package-datatable.component.scss'
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
    { field: 'name', header: 'Package Name' },
    { field: 'packageCode', header: 'Package Code/Source' },
    { field: 'description', header: 'Description' },
    { field: 'type', header: 'Type' },
    { field: 'rate', header: 'Amount' },
    { field: 'status', header: 'Active' },
  ];

  constructor(
    private _packageService: PackageService,
    private _route: ActivatedRoute,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _router: Router,
    public fb: FormBuilder
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
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

  getHotelId(globalQueries) {
    //todo 

    globalQueries.forEach(element => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
    this.fetchDataFrom(queries).subscribe(
      (data) => {
        this.values = new Packages().deserialize(data).records;
        //set pagination
        this.totalRecords = data.total;
        this.loading = false;
      },
      ({error}) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
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
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this._packageService.getHotelPackages(config);
  }


  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
    this.fetchDataFrom(
      [...this.globalQueries,
    {
      order: 'DESC',
    },], {
      offset: this.first,
      limit: this.rowsPerPage,
    }).subscribe(
      (data) => {
        this.values = new Packages().deserialize(data).records;

        //set pagination
        this.totalRecords = data.total;
        this.loading = false;
      },
      ({error}) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
      )
    );
  }

  updatePaginations(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  exportCSV() {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
    this._packageService.exportCSV(config).subscribe(
      (res) => {
        FileSaver.saveAs(
          res,
          this.tableName.toLowerCase() + '_export_' + new Date().getTime() + '.csv'
        );
        this.loading = false;
      },
      ({error}) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
     )
    );
  }

  updatePackageStatus(event, packageId) {
    let packages = [];
    packages.push(packageId);
    this._packageService.updatePackageStatus(this.hotelId, event.checked, packages)
      .subscribe(response => {
        this._snackbarService.openSnackBarAsText('Status updated successfully',
          '',
          { panelClass: 'success' }
        );
      }, ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      })
  }

  redirectToAddPackage() {
    this._router.navigate(['amenity'], { relativeTo: this._route });
  }

  openPackageDetails(amenity) {
    this._router.navigate(['amenity', amenity.id], { relativeTo: this._route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }
}
