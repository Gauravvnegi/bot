import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NotificationComponent } from 'libs/admin/notification/src/lib/components/notification/notification.component';
import { ShareIconConfig } from 'libs/admin/shared/src/lib/models/detailsConfig.model';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import {
  Guest,
  GuestReservation,
} from '../../../../../guests/src/lib/data-models/guest-table.model';
import { GuestDetailService } from '../../services/guest-detail.service';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isReservationDetailFetched: boolean = false;
  isGuestInfoPatched: boolean = false;
  @Input() guestId;
  data: Guest;
  @Input() tabKey = 'guest_details';
  @Input() hotelId;
  detailsFG: FormGroup;
  details: GuestReservation;
  $subscription = new Subscription();
  reservationData;
  branchConfig;
  shareIconList;

  defaultIconList = [
    { iconUrl: 'assets/svg/messenger.svg', label: 'Request', value: '' },
    { iconUrl: 'assets/svg/email.svg', label: 'Email', value: 'email' },
  ];

  detailsConfig = [
    {
      key: 'guest_details',
      index: 0,
    },
    {
      key: 'document_details',
      index: 1,
    },
    {
      key: 'stay_details',
      index: 2,
    },
  ];

  @Output() onDetailsClose = new EventEmitter();

  constructor(
    private guestDetailService: GuestDetailService,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private _snackBarService: SnackBarService,
    private router: Router,
    private _modal: ModalService,
    private _hotelDetailService: HotelDetailService,
    private _globalFilterService: GlobalFilterService,
    private _userDetailService: UserDetailService
  ) {}

  ngOnInit(): void {
    this.getShareIcon();
  }

  ngAfterViewInit(): void {
    this.loadGuestInfo();
  }

  getShareIcon() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        const { hotelName: brandId, branchName: branchId } = data[
          'filter'
        ].value.property;
        const brandConfig = this._hotelDetailService.hotelDetails.brands.find(
          (brand) => brand.id == brandId
        );
        this.branchConfig = brandConfig.branches.find(
          (branch) => branch.id == branchId
        );
      })
    );
    this._userDetailService
      .getUserShareIconByNationality(this.branchConfig.nationality)
      .subscribe(
        (response) => {
          this.shareIconList =
            new ShareIconConfig().deserialize(response);
          this.shareIconList = this.shareIconList.applications.concat(
            this.defaultIconList
          );
       
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
        }
      );
  }

  loadGuestInfo(): void {
    this.guestDetailService.getGuestById(this.guestId).subscribe(
      (response) => {
        this.data = new Guest().deserialize(response);
        this.loadGuestReservations();
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
        this.closeDetails();
      }
    );
  }

  loadGuestReservations(): void {
    this.guestDetailService.getGuestReservations(this.guestId).subscribe(
      (response) => {
        this.details = new GuestReservation().deserialize(response);
        this.isReservationDetailFetched = true;
        this.initFG();
      },
      ({ error }) => {
        this._snackBarService.openSnackBarAsText(error.message);
        this.closeDetails();
      }
    );
  }

  initFG(): void {
    this.detailsFG = this.fb.group({
      stayDetails: this.fb.group({}),
      documents: this.fb.group({}),
      guestDetails: this.fb.group({}),
    });
  }

  openSendNotification(channel) {
    if (channel) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '100%';
      const notificationCompRef = this._modal.openDialog(
        NotificationComponent,
        dialogConfig
      );

      if (channel === 'email') {
        notificationCompRef.componentInstance.isEmail = true;
        notificationCompRef.componentInstance.email = this.data.email;
      } else {
        notificationCompRef.componentInstance.isEmail = false;
        notificationCompRef.componentInstance.channel = channel;
      }

      notificationCompRef.componentInstance.roomNumber = this.data.rooms.roomNumber;
      notificationCompRef.componentInstance.hotelId = this.hotelId;
      notificationCompRef.componentInstance.isModal = true;
      notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
        // remove loader for detail close
        notificationCompRef.close();
      });
    } else {
      this.closeDetails();
      this.router.navigateByUrl('/pages/request');
    }
  }

  addFGEvent(data) {
    this.detailsFG.setControl(data.name, data.value);
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  get guestData() {
    return {
      title: this.data.nameTitle,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      countryCode: this.data.countryCode,
      phoneNumber: this.data.phoneNumber,
      email: this.data.email,
    };
  }

  get bookingCount() {
    let count = 0;
    count += this.details.pastBookings.length;
    count += this.details.presentBookings.length;
    count += this.details.upcomingBookings.length;
    return count;
  }

  setTabKey(key: string) {
    this.tabKey = key;
  }

  get bookingTitle() {
    return this.details.presentBookings.length
      ? 'Current Booking'
      : this.details.upcomingBookings.length
      ? 'Upcoming Booking'
      : 'Past Booking';
  }

  get tabIndex() {
    let { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key == this.tabKey
    );
    return index ? index : 0;
  }
}
