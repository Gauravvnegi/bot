import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Observable, Subscription } from 'rxjs';
import { Categories } from '../../data-models/categoryConfig.model';
import { CategoriesService } from '../../services/category.service';

@Component({
  selector: 'hospitality-bot-categories-datatable',
  templateUrl: './categories-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './categories-datatable.component.scss',
  ],
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
    {
      field: 'name',
      header: 'Category Name',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'description',
      header: 'Description',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'subPackageNameList',
      header: 'Packages',
      sortType: 'string',
      isSort: true,
    },
  ];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
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
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  customSort(event: SortEvent) {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    let field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new Categories().deserialize(data).records;
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
    return this.categoriesService.getHotelCategories(config);
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
          this.values = new Categories().deserialize(data).records;

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
      this.categoriesService.exportCategoryCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
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

  redirectToAddCategory(): void {
    this.router.navigate(['category'], { relativeTo: this.route });
  }

  openCategoryDetails(category): void {
    this.router.navigate(['category', category.id], { relativeTo: this.route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith'): void {
    // value = value && value.trim();
    // this.table.filter(value, field, matchMode);

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
}
