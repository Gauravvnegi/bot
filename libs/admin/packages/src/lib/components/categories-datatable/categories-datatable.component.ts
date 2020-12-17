import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { Categories } from '../../data-models/categoryConfig.model';
import { CategoriesService } from '../../services/category.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-categories-datatable',
  templateUrl: './categories-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './categories-datatable.component.scss'
  ]
})
export class CategoriesDatatableComponent extends BaseDatatableComponent {

  tableName = 'Categories';
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
    { field: 'name', header: 'Category Name' },
    { field: 'description', header: 'Description' },
    { field: 'subPackageNameList', header: 'Packages' },
  ];
  
  constructor(
    public fb: FormBuilder,
    private _route: ActivatedRoute,
    private _categoriesService: CategoriesService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _router: Router,
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
        this.values = new Categories().deserialize(data).records;
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
    return this._categoriesService.getHotelCategories(config);
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
        this.values = new Categories().deserialize(data).records;

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
    this._categoriesService.exportCategoryCSV(config).subscribe(
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

  redirectToAddCategory() {
     this._router.navigate(['category'], { relativeTo: this._route });
  }

  openCategoryDetails(category) {
    this._router.navigate(['category', category.id], { relativeTo: this._route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

}
