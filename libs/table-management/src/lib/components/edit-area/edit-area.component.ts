import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdminUtilityService,
  ModuleNames,
  NavRouteOption,
} from '@hospitality-bot/admin/shared';
import { TableManagementService } from '../../services/table-management.service';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  tableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import { Subscription } from 'rxjs';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AreaFormData, AreaPayloadData } from '../../models/edit-area.model';
import { AreaForm } from '../../types/edit-area.type';
import { TableListResponse } from '../../types/table-datable.type';
import { TableValue } from '../../constants/table-datable';

@Component({
  selector: 'hospitality-bot-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss'],
})
export class EditAreaComponent implements OnInit {
  entityId: string;
  pageTitle: string = 'Create Area';
  navRoutes: NavRouteOption[] = [];
  loading: boolean = false;
  areaId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  tableForm: FormGroup;
  tableListForm: FormGroup;
  tableList: { id: string; label: string; controlName: string }[];
  attachedTableNumber: string[];

  constructor(
    private fb: FormBuilder,
    private routesConfigService: RoutesConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService
  ) {
    this.areaId = this.route.snapshot.paramMap.get(tableManagementParmId.AREA);
    const { navRoutes, title } = this.areaId
      ? tableManagementRoutes.editArea
      : tableManagementRoutes.createArea;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId =
      this.tableManagementService.entityId ?? this.globalFilterService.entityId;
    this.initForm();
    this.initNavRoutes();
  }

  initForm() {
    this.useForm = this.fb.group({
      status: [true],
      id: [''],
      name: ['', [Validators.required]],
      description: [],
      shortDescription: ['', [Validators.required]],
      attachedTables: [[]],
      removedTables: [[]],
    });

    this.tableForm = this.fb.group({
      selectAll: [false],
      tableList: this.tableListForm,
    });

    if (this.areaId) {
      this.getTableList();
      this.getAreaDetails();
    }
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  getAreaDetails() {
    this.tableManagementService
      .getAreaById(this.entityId, this.areaId)
      .subscribe((res) => {
        const data = new AreaFormData().deserialize(res);
        this.useForm.patchValue({ ...data });
        this.attachedTableNumber = data?.tables;

        //updating tables control value
        const controls = this.tableListForm?.controls;
        controls &&
          Object.keys(controls).forEach((key) => {
            controls[key].setValue(this.attachedTableNumber?.includes(key));
          });
      }, this.handleError);
  }

  getTableList() {
    this.$subscription.add(
      this.tableManagementService
        .getList<TableListResponse>(this.entityId, {
          params: this.adminUtilityService.makeQueryParams([
            {
              type: TableValue.Table,
              offset: '0',
              limit: '0',
              sort: 'updated',
            },
          ]),
        })
        .subscribe((res) => {
          this.tableList = res.tables.map((item) => {
            return {
              label: item?.number,
              id: item?.id,
              controlName: item?.number,
            };
          });
          this.initTableControl();
        })
    );
  }

  initTableControl() {
    this.tableListForm = this.fb.group({});

    this.tableList?.forEach((item) => {
      this.tableListForm.addControl(
        item?.controlName,
        this.fb.control(this.attachedTableNumber?.includes(item?.controlName))
      );
      this.tableListForm
        .get(item?.controlName)
        .valueChanges.subscribe((res) => {
          this.toggleCheckboxSelection();
          const { removedTables, attachedTables } = this.areaFormControls;

          if (res) {
            if (!attachedTables?.value?.includes(item?.id)) {
              attachedTables.patchValue([...attachedTables.value, item.id]);
            }
          } else {
            if (attachedTables?.value?.includes(item?.id)) {
              removedTables.patchValue([...removedTables.value, item.id]);
            }
          }
        });
    });

    this.tableFormControls.selectAll?.valueChanges.subscribe(
      (item: boolean) => {
        const controls = this.tableListForm?.controls;
        Object.keys(controls).forEach((key) => {
          controls[key].setValue(item);
        });
      }
    );
    //to check if all controls are selected then mark select all checked else unchecked
    this.toggleCheckboxSelection();
  }

  /**
   * To mark select control check/uncheck
   */
  toggleCheckboxSelection() {
    const controls = this.tableListForm.controls;
    if (Object.keys(controls).some((key) => !controls[key].value)) {
      this.tableFormControls.selectAll.patchValue(false, { emitEvent: false });
    } else {
      this.tableFormControls.selectAll.patchValue(true, { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Please fill all the fields');
      return;
    }

    const areaFormData: AreaForm = new AreaPayloadData().deserialize(
      this.useForm.getRawValue()
    );

    if (this.areaId) {
      this.$subscription.add(
        this.tableManagementService
          .updateArea(this.entityId, { area: areaFormData })
          .subscribe((res) => {}, this.handleError, this.handleSuccess)
      );
    } else {
      this.$subscription.add(
        this.tableManagementService
          .createArea(this.entityId, areaFormData)
          .subscribe((res) => {}, this.handleError, this.handleSuccess)
      );
    }
  }

  onReset() {
    this.useForm.reset();
  }

  handleSuccess = (): void => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Area is ${!this.areaId ? 'created' : 'edited'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TABLE_MANAGEMENT,
    });
  };

  statusUpdate(status: boolean) {
    this.areaFormControls.status.patchValue(status);
  }

  handleError = ({ error }): void => {
    this.loading = false;
  };

  isBorderNone(index: number): boolean {
    index++;
    const block = this.divideIntoBlocks(this.tableList.length);
    if (
      block.length === 1 ||
      (index >= block[block.length - 1][0] &&
        index <= block[block.length - 1][1])
    ) {
      return true;
    } else {
      return false;
    }
  }

  divideIntoBlocks(
    number: number,
    blockSize: number = 8
  ): Array<Array<number>> {
    const blocks = [];
    let start = 1;

    while (start <= number) {
      const end = Math.min(start + blockSize - 1, number);
      blocks.push([start, end]);
      start = end + 1;
    }

    return blocks;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get areaFormControls() {
    return this.useForm.controls as Record<keyof AreaForm, AbstractControl>;
  }

  get tableFormControls() {
    return this.tableForm.controls as Record<keyof TableForm, AbstractControl>;
  }
}

type TableForm = {
  selectAll: boolean;
  tableList: {};
};
