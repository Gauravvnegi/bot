import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  ModuleNames,
  NavRouteOption,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import {
  tableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import {
  TableValue,
  tableManagementConfig,
} from '../../constants/table-datable';
import { AreaData, AreaList } from '../../models/data-table.model';
import {
  MultipleTable,
  MultipleTableList,
  SingleTable,
  SingleTableList,
  TableFormData,
} from '../../models/edit-table.model';
import { TableManagementService } from '../../services/table-management.service';
import {
  MultipleTableForm,
  SingleTableForm,
  TableForm,
} from '../../types/edit-table.type';
import {
  AreaListResponse,
  TableFormSubmissionType,
} from '../../types/table-datable.type';

@Component({
  selector: 'hospitality-bot-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss'],
})
export class EditTableComponent implements OnInit {
  entityId: string;
  navRoutes: NavRouteOption[] = [];
  pageTitle: string = 'Add Table';
  loading: boolean = false;
  tableId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  useFormArray: FormArray;
  fields = [];
  formSubmissionType: TableFormSubmissionType = 'SINGLE';
  areaOffset: number = 0;
  areaLimit: number = 10;

  areaList: Option[] = [];
  isLoadingAreaList: boolean = false;
  noMoreRoomTypes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService
  ) {
    this.tableId = this.route.snapshot.paramMap.get(
      tableManagementParmId.TABLE
    );
    const { navRoutes, title } = this.tableId
      ? tableManagementRoutes.editable
      : tableManagementRoutes.createTable;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;

    if (this.route?.snapshot?.queryParams?.type)
      this.formSubmissionType = this.route?.snapshot?.queryParams?.type;

    this.initForm();
    this.initNavRoutes();
    this.initOptions();

    this.fields =
      tableManagementConfig.TABLE.iteratorFields[this.formSubmissionType];
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  initOptions() {
    this.getAreaList();
  }

  initForm() {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      areaId: [''],
      tables: this.useFormArray,
    });

    if (this.tableId) {
      this.getTableDetails();
    }
  }

  getTableDetails() {
    this.$subscription.add(
      this.tableManagementService
        .getTableById(this.entityId, this.tableId)
        .subscribe((res) => {
          const data = new TableFormData().deserialize(res);
          this.useForm.patchValue({ ...data });
        }, this.handleError)
    );
  }

  onLoadMoreArea() {
    this.areaOffset = this.areaOffset + 10;
    this.getAreaList();
  }

  onSearchArea(text: string) {
    if (text) {
      this.loading = true;
      this.tableManagementService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=${TableValue.Area}`,
        })
        .subscribe(
          (res) => {
            const data = res && res[TableValue.Area];
            this.areaLimit =
              data
                ?.filter((item) => item.status)
                .map((item) => {
                  const areaData = new AreaData().deserialize(item);

                  return {
                    label: areaData.name,
                    value: areaData.id,
                  };
                }) ?? [];
          },
          (error) => {},
          () => {
            this.loading = false;
          }
        );
    } else {
      this.areaOffset = 0;
      this.areaList = [];
      this.getAreaList();
    }
  }

  onCreateArea() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TABLE_MANAGEMENT,
      additionalPath: tableManagementRoutes.createArea.route,
    });
  }

  getAreaList() {
    this.loading = true;
    this.$subscription.add(
      this.tableManagementService
        .getList<AreaListResponse>(this.entityId, {
          params: `?type=${TableValue.Area}&offset=${this.areaOffset}&limit=${this.areaLimit}`,
        })
        .subscribe((res) => {
          const data = new AreaList().deserialize(res);
          this.areaList = data.records.map((item) => ({
            label: item.name,
            value: item?.id,
          }));
          this.loading = false;
        }, this.handleError)
    );
  }

  onSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Please fill all the fields');
      return;
    }
    if (this.tableId) {
      this.updateTable();
    } else {
      this.addTable();
    }
  }

  updateTable() {
    const { areaId, tables } = this.useForm.getRawValue() as TableForm<
      SingleTableForm
    >;
    const data = new SingleTable().deserialize(tables[0], areaId, this.tableId);

    this.$subscription.add(
      this.tableManagementService
        .updateTable(this.entityId, { table: data })
        .subscribe((res) => {}, this.handleError, this.handleSuccess)
    );
  }

  addTable() {
    const tableFormData =
      this.formSubmissionType === 'MULTIPLE'
        ? new MultipleTableList().deserialize(this.useForm.getRawValue())
        : new SingleTableList().deserialize(this.useForm.getRawValue());

    this.$subscription.add(
      this.tableManagementService
        .createTable(this.entityId, tableFormData)
        .subscribe((res) => {}, this.handleError, this.handleSuccess)
    );
  }

  handleSuccess = (): void => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Table is ${!this.tableId ? 'created' : 'edited'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TABLE_MANAGEMENT,
    });
  };

  handleError = ({ error }): void => {
    this.loading = false;
  };

  onReset() {
    this.useForm.reset();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
