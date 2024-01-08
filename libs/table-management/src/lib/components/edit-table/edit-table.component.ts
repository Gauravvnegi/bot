import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { NavRouteOption, Option } from '@hospitality-bot/admin/shared';
import {
  TableManagementParmId,
  tableManagementRoutes,
} from '../../constants/routes';
import { ActivatedRoute, Router } from '@angular/router';
import { TableManagementService } from '../../services/table-management.service';
import { Subscription } from 'rxjs';
import { TableFormSubmissionType } from '../../types/table-datable.type';
import { tableManagementConfig } from '../../constants/table-datable';

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

  areaList: Option[] = [];
  isLoadingAreaList: boolean = false;
  noMoreRoomTypes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private tableManagementService: TableManagementService,
    private globalFilterService: GlobalFilterService
  ) {
    this.tableId = this.route.snapshot.paramMap.get(
      TableManagementParmId.TABLE
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

    this.fields =
      tableManagementConfig.TABLE.iteratorFields[this.formSubmissionType];
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  initForm() {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      areaId: [''],
      rooms: this.useFormArray,
    });
  }

  onLoadMoreArea() {
    /**
     * on select area paginates
     */
  }

  onSearchArea(text: string) {
    /**
     * code for api search for area
     */
  }

  onCreateArea() {
    /**
     * on create area
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

  onReset() {}

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
