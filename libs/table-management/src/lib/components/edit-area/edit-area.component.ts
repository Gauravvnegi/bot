import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleNames, NavRouteOption } from '@hospitality-bot/admin/shared';
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
import { AreaFormData } from '../../models/edit-area.model';
import { AreaForm } from '../../types/edit-area.type';

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
  tableList = new Array(10).fill(1);

  constructor(
    private fb: FormBuilder,
    private routesConfigService: RoutesConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService
  ) {
    this.areaId = this.route.snapshot.paramMap.get(tableManagementParmId.AREA);
    const { navRoutes, title } = this.areaId
      ? tableManagementRoutes.editArea
      : tableManagementRoutes.createArea;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;

    this.initForm();
    this.initNavRoutes();
  }

  initForm() {
    this.useForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['test'],
      shortDescription: ['', [Validators.required]],
    });

    this.tableForm = this.fb.group({
      selectAll: [false],
    });

    if (this.areaId) {
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
        const data: AreaForm = new AreaFormData().deserialize(res);
        this.useForm.patchValue({ ...data });
      }, this.handleError);
  }

  onReset() {
    this.useForm.reset();
  }

  onSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Please fill all the fields');
      return;
    }
    const areaFormData: AreaForm = this.useForm.getRawValue();
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

  handleError = ({ error }): void => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
