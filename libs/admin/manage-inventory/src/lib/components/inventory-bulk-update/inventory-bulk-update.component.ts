import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  ModuleNames,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import {
  CheckBoxTreeFactory,
  RoomTypes,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { UpdateInventory } from 'libs/admin/channel-manager/src/lib/models/channel-manager.model';
import { ChannelManagerService } from '../../services/channel-manager.service';
import { Router } from '@angular/router';
import { inventoryRestrictions } from 'libs/admin/channel-manager/src/lib/constants/data';

@Component({
  selector: 'hospitality-bot-inventory-bulk-update',
  templateUrl: './inventory-bulk-update.component.html',
  styleUrls: ['./inventory-bulk-update.component.scss'],
})
export class InventoryBulkUpdateComponent implements OnInit {
  readonly inventoryRestrictions = inventoryRestrictions;
  entityId: string;
  inventoryTreeList = [];
  useForm: FormGroup;
  pageTitle = 'Bulk Update';
  loading = false;
  $subscription = new Subscription();
  isRoomsEmpty = false;
  navRoutes: NavRouteOptions = [{ label: 'Bulk Update', link: './' }];
  roomTypes: RoomTypes[] = [];
  today = new Date();
  seventhDate = new Date();
  constructor(
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private formService: ChannelManagerFormService,
    public snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private channelManagerService: ChannelManagerService,
    public router: Router,
    private routeConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.today.setHours(0, 0, 0, 0);
    this.seventhDate.setHours(0, 0, 0, 0);
    this.seventhDate.setDate(this.today.getDate() + 7);

    this.useForm = this.fb.group({
      update: ['availability'], // RATE, AVAILABILITY,
      updateValue: ['', [Validators.required, Validators.min(0)]],
      fromDate: [this.today.getTime(), [Validators.required]],
      toDate: [this.seventhDate.getTime(), [Validators.required]],
      roomType: [''],
      roomTypes: [
        this.fb.group({
          roomTypeIds: [[], [Validators.required, this.validateRoomTypeIds]],
          channelIds: [],
        }),
      ],
      selectedDays: [[], [Validators.required]],
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

  get isFormValid() {
    return (
      this.useForm.valid &&
      (this.useForm.controls['roomTypes'].value as FormGroup).valid
    );
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
    this.inventoryTreeList = CheckBoxTreeFactory.buildTree(
      this.roomTypes,
      controls.roomType,
      { isInventory: true }
    );
    this.loading = false;
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
    const data = UpdateInventory.buildBulkUpdateRequest(
      this.useForm.getRawValue()
    );

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
              'Bulk Inventory Updated successfully',
              '',
              { panelClass: 'success' }
            );
            this.routeConfigService.navigate({
              subModuleName: ModuleNames.CHANNEL_MANAGER_HOME,
              additionalPath: 'manage-inventory',
            });
            this.loading = false;
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
          inventoryUpdateType: 'INVENTORY',
        },
      ]),
    };
    return config;
  }
  validateRoomTypeIds(control: AbstractControl): ValidationErrors | null {
    const roomTypeIds = control.value;
    if (!roomTypeIds || roomTypeIds.length === 0) {
      // If roomTypeIds is empty, mark the entire form as invalid
      return { roomTypeIdsRequired: true };
    }
    return null;
  }

  handleFinal() {
    this.loading = false;
  }
}
