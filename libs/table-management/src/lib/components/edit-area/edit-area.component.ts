import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOption } from '@hospitality-bot/admin/shared';
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
    private globalFilterService: GlobalFilterService
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
      name: '',
      description: '',
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
      .subscribe(
        (res) => {
          /**
           * model for get by id
           */
        },
        this.handleError,
        this.handleSuccess
      );
  }

  onReset() {
    /**
     * reset
     */
  }

  onSubmit() {
    const areaFormData: AreaForm = this.useForm.getRawValue();

    this.useForm.get('');

    this.$subscription.add(
      this.tableManagementService
        .createTable(this.entityId, '')
        .subscribe((res) => {}, this.handleError, this.handleSuccess)
    );
  }

  handleSuccess = (): void => {
    this.loading = false;
  };

  handleError = ({ error }): void => {
    this.loading = false;
  };

  // getFormControls() {
  //   return this.useForm.controls as AreaForm;
  // }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
