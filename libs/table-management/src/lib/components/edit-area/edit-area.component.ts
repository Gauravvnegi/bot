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
  TableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import { Subscription } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private routesConfigService: RoutesConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService
  ) {
    this.areaId = this.route.snapshot.paramMap.get(TableManagementParmId.AREA);
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
      name: [''],
      description: [''],
    });
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  onReset() {
    /**
     * reset
     */
  }

  onSubmit() {
    this.$subscription.add(
      this.tableManagementService
        .createTable('', '')
        .subscribe((res) => {}, this.handleError, this.handleSuccess)
    );
  }

  handleSuccess = (): void => {
    this.loading = false;
  };

  handleError = ({ error }): void => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
