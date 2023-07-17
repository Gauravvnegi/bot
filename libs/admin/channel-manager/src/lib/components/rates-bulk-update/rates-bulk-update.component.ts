import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { CheckBoxTreeFactory } from '../../models/bulk-update.models';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { UpdateRates } from '../../models/channel-manager.model';
import { ChannelManagerService } from '../../services/channel-manager.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-rates-bulk-update',
  templateUrl: './rates-bulk-update.component.html',
  styleUrls: ['./rates-bulk-update.component.scss'],
})
export class RatesBulkUpdateComponent implements OnInit {
  entityId: string;
  roomsData: any;
  useForm: FormGroup;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [
    {
      label: 'Update Rates',
      link: '/pages/channel-manager/update-rates/',
    },
    { label: 'Bulk Update', link: './' },
  ];
  startMinDate = new Date();
  endMinDate = new Date();
  loading = false;
  $subscription = new Subscription();
  roomTypes = [];

  constructor(
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private formService: ChannelManagerFormService,
    private adminUtilityService: AdminUtilityService,
    private channelManagerService: ChannelManagerService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seventhDate = new Date();
    seventhDate.setHours(0, 0, 0, 0);
    seventhDate.setDate(today.getDate() + 7);

    this.useForm = this.fb.group({
      update: ['availability'], // RATE, AVAILABILITY,
      updateValue: ['', [Validators.required, Validators.min(0)]],
      fromDate: [today.getTime(), [Validators.required]],
      toDate: [seventhDate.getTime(), [Validators.required]],
      roomType: [[]],
      roomTypes: this.fb.array([], [Validators.required]),
      selectedDays: [[new FormControl()], [Validators.required]],
    });
    this.listenChanges();
    this.loadRooms();
  }

  loadRooms() {
    this.formService.roomDetails.subscribe((rooms) => {
      this.roomTypes = rooms;
      !this.roomTypes.length && this.formService.loadRoomTypes(this.entityId);
      this.loadTree({ roomType: '' });
    });
  }

  listenChanges() {
    // this.useForm.valueChanges.subscribe((value) => {
    //   this.roomTypes;
    //   this.loadTree(value);
    // });
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
          { updates: data },
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
