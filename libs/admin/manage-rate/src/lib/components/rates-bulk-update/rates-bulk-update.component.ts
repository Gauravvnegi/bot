import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  ModuleNames,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { CheckBoxTreeFactory } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { UpdateRates } from 'libs/admin/channel-manager/src/lib/models/channel-manager.model';
import { ChannelManagerService } from '../../services/channel-manager.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Router } from '@angular/router';
import { ratesRestrictions } from 'libs/admin/channel-manager/src/lib/constants/data';
@Component({
  selector: 'hospitality-bot-rates-bulk-update',
  templateUrl: './rates-bulk-update.component.html',
  styleUrls: ['./rates-bulk-update.component.scss'],
})
export class RatesBulkUpdateComponent implements OnInit {
  readonly ratesRestrictions = ratesRestrictions;
  entityId: string;
  roomsData: any;
  useForm: FormGroup;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [{ label: 'Bulk Update', link: './' }];
  today = new Date();
  seventhDate = new Date();
  loading = false;
  isRoomsEmpty = false;
  $subscription = new Subscription();
  roomTypes = [];

  constructor(
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private formService: ChannelManagerFormService,
    private adminUtilityService: AdminUtilityService,
    private channelManagerService: ChannelManagerService,
    private snackbarService: SnackBarService,
    private router: Router,
    private routeConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.seventhDate.setHours(0, 0, 0, 0);
    this.seventhDate.setDate(this.today.getDate() + 7);

    this.useForm = this.fb.group({
      update: ['rates'], // RATE, AVAILABILITY,
      updateValue: ['', [Validators.required, Validators.min(0)]],
      fromDate: [this.today.getTime(), [Validators.required]],
      toDate: [this.seventhDate.getTime(), [Validators.required]],
      roomType: [[]],
      roomTypes: this.fb.array([], [Validators.required]),
      selectedDays: [[new FormControl()], [Validators.required]],
    });
    this.listenChanges();
    this.loadRooms();
    this.initNavRoutes();
  }

  initNavRoutes() {
    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, ...this.navRoutes];
    });
  }

  loadRooms() {
    this.formService.roomDetails.subscribe((rooms) => {
      if (this.formService.isRoomDetailsLoaded) {
        this.roomTypes = rooms;
        this.loadTree({ roomType: [] });
      } else {
        this.formService.loadRoomTypes(this.entityId);
      }
    });
  }

  listenChanges() {
    this.useForm.controls['roomType'].valueChanges.subscribe((value) => {
      this.isRoomsEmpty = !value.length;
      !this.isRoomsEmpty && this.loadTree(this.useForm.getRawValue());
    });
  }

  loadTree(controls) {
    this.roomsData = CheckBoxTreeFactory.buildTree(
      this.roomTypes,
      controls.roomType,
      { isInventory: false }
    );
  }

  get isFormValid() {
    return this.useForm.valid;
  }

  onSubmit() {
    if (!this.isFormValid) {
      this.snackbarService.openSnackBarAsText(
        'Please Fix Form before submit',
        '',
        { panelClass: 'error' }
      );
      return;
    }

    this.loading = true;
    const data = UpdateRates.buildBulkUpdateRequest(this.useForm.getRawValue());

    this.$subscription.add(
      this.channelManagerService
        .updateChannelManager(
          { inventoryList: data },
          this.entityId,
          this.getQueryConfig()
        )
        .subscribe(
          (res) => {
            this.snackbarService.openSnackBarAsText(
              'Bulk Rates Updated successfully',
              '',
              { panelClass: 'success' }
            );
            this.loading = false;
            this.routeConfigService.navigate({
              subModuleName: ModuleNames.CHANNEL_MANAGER_HOME,
              additionalPath: 'manage-rate',
            });
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          limit: 5,
          inventoryUpdateType: 'RATES',
        },
      ]),
    };
    return config;
  }

  handleFinal() {
    this.loading = false;
  }
}
