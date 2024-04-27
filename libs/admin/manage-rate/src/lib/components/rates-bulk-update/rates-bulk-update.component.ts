import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
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
import {
  CheckBoxTreeFactory,
  Pax,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { Subject, Subscription } from 'rxjs';
import { UpdateRates } from 'libs/admin/channel-manager/src/lib/models/channel-manager.model';
import { ChannelManagerService } from '../../services/channel-manager.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ratesRestrictions } from 'libs/admin/channel-manager/src/lib/constants/data';
import { RATE_CONFIG_TYPE } from '../../constants/rates.const';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/types/bulk-update.types';
@Component({
  selector: 'hospitality-bot-rates-bulk-update',
  templateUrl: './rates-bulk-update.component.html',
  styleUrls: ['./rates-bulk-update.component.scss'],
})
export class RatesBulkUpdateComponent implements OnInit {
  readonly ratePlanConfig = RATE_CONFIG_TYPE;
  readonly ratesRestrictions = ratesRestrictions;
  entityId: string;
  roomsData: RoomTypes[];
  useForm: FormGroup;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [{ label: 'Bulk Update', link: './' }];
  today = new Date();
  seventhDate = new Date();
  loading = false;
  isRoomsEmpty = false;
  $subscription = new Subscription();
  roomTypes = [];
  configType: RATE_CONFIG_TYPE;
  treeValid = true;

  loadingStatus = {
    configLoading: false,
    roomLoading: false,
  };

  $treeBuild = new Subject<{
    configLoading: boolean;
    roomLoading: boolean;
  }>();

  roomDataControls: FormArray;

  constructor(
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private formService: ChannelManagerFormService,
    private adminUtilityService: AdminUtilityService,
    private channelManagerService: ChannelManagerService,
    private snackbarService: SnackBarService,
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
      roomType: [[], [Validators.required]],
      roomTypes: this.fb.array([], [Validators.required]),
      selectedDays: [[new FormControl()], [Validators.required]],
    });
    this.listenTreeBuilder();
    this.initConfigType();
    this.loadRooms();
    this.initNavRoutes();
    this.listenChanges();
  }

  initNavRoutes() {
    this.routeConfigService.navRoutesChanges.subscribe((navRoutes) => {
      this.navRoutes = [...navRoutes, ...this.navRoutes];
    });
  }

  /**
   * @function initConfigType will set the view RATE_PLAN_BASED or PAX_BASED
   * Initialize configuration type by fetching data from the Channel Manager service.
   * Sets the loading flag to true before making the request and updates it upon success or error.
   */
  initConfigType() {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getConfigType({ 'entity-id': this.entityId })
        .subscribe(
          (res) => {
            this.configType = res.type;
            this.loadingStatus.configLoading = true;
            this.$treeBuild.next(this.loadingStatus);
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  listenTreeBuilder() {
    this.$subscription.add(
      this.$treeBuild.subscribe((res) => {
        if (res.configLoading && res.roomLoading) {
          this.loadTree({ roomType: [] });
        }
      })
    );
  }

  filterConfiguration() {
    if (this.configType == RATE_CONFIG_TYPE.ratePlan) {
      //Removing all pax, if configuration is ratePlan type
      this.roomDataControls.controls?.forEach((control) => {
        (control.get('variants') as FormArray).controls.forEach(
          (variantControls: FormGroup) => {
            variantControls.setControl('pax', new FormArray([]));
          }
        );
      });
    }
  }

  loadRooms() {
    this.formService.roomDetails.subscribe((rooms) => {
      if (this.formService.isRoomDetailsLoaded) {
        this.roomTypes = rooms;
      } else {
        this.formService.loadRoomTypes(this.entityId);
      }

      this.loadingStatus.roomLoading = true;
      this.$treeBuild.next(this.loadingStatus);
    });
  }

  listenChanges() {
    this.useForm.controls['roomType'].valueChanges.subscribe((value) => {
      this.isRoomsEmpty = !value.length;
      !this.isRoomsEmpty && this.loadTree(this.useForm.getRawValue());
    });
  }

  loadTree(controls) {
    this.useForm.addControl('roomTypeNestedData', this.fb.array([]));
    this.roomDataControls = this.useForm.get('roomTypeNestedData') as FormArray;

    this.roomDataControls.controls = CheckBoxTreeFactory.buildTree(
      this.roomTypes,
      controls.roomType,
      {
        isInventory: false,
      }
    ).controls;

    this.filterConfiguration();
  }

  onSubmit() {
    // const { formStatus, treeStatus } = this.formService.validateUpdateForm(
    //   this.useForm,
    //   this.roomsData
    // );
    // this.treeValid = treeStatus;

    // if (!formStatus || !treeStatus) {
    //   this.snackbarService.openSnackBarAsText(
    //     formStatus
    //       ? `At least 1 ${
    //           this.configType == RATE_CONFIG_TYPE.pax ? 'Pax' : 'Rateplan'
    //         } is required`
    //       : 'Please Fix Form before submit',
    //     '',
    //     { panelClass: 'error' }
    //   );
    //   this.useForm.markAllAsTouched();
    //   return;
    // }
    const testData = this.roomDataControls.getRawValue();

    this.loading = true;
    const data = UpdateRates.buildBulkUpdateRequest(
      this.useForm.getRawValue(),
      this.configType,
      testData
    );

    console.log(testData);

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
