import {
  Component,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { RequestService } from '../../services/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Guest, GuestDetails, Requests } from '../../data-models/request.model';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges, OnDestroy {
  isGuestReservationFetched = false;
  guestReservations: GuestDetails;
  guestId: string;
  data;
  @Output() closeInfo = new EventEmitter();
  @Output() onDetailsClose = new EventEmitter();
  bookingFG: FormGroup;

  @ViewChild('matTab') matTab: MatTabGroup;
  $subscription = new Subscription();
  guestData;
  hotelId: string;
  isLoading = false;
  selectedIndex = 0;
  requestList;
  buttonConfig = [
    {
      button: true,
      label: 'Edit Details',
      icon: 'assets/svg/user.svg',
    },
    {
      button: true,
      label: 'Map Details',
      icon: 'assets/svg/user.svg',
    },
    { button: true, label: 'Raise Request', icon: 'assets/svg/requests.svg' },
  ];
  colorMap: any;
  constructor(
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private requestService: RequestService,
    private _fb: FormBuilder
  ) {}

  ngOnChanges() {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForSelectedRequest();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.hotelId = this.globalFilterService.hotelId;
      })
    );
  }

  listenForSelectedRequest() {
    this.$subscription.add(
      this.requestService.selectedRequest.subscribe((response) => {
        if (response) {
          this.data = response;
          this.guestId = response['guestDetails']?.primaryGuest?.id;
          this.loadGuestInfo();
          this.loadGuestRequests();
        }
      })
    );
  }

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }

  onTabChanged(event) {
    this.selectedIndex = event.index;
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  loadGuestInfo(): void {
    this.$subscription.add(
      this.requestService.getGuestById(this.guestId).subscribe(
        (response) => {
          this.guestData = new Guest().deserialize(response);
          this.loadGuestReservations();
        },
        ({ error }) => { 
          this.closeDetails();
        }
      )
    );
  }

  loadGuestReservations(): void {
    this.$subscription.add(
      this.requestService.getGuestReservations(this.guestId).subscribe(
        (response) => {
          this.guestReservations = new GuestDetails().deserialize(
            response,
            this.colorMap
          );

          this.isGuestReservationFetched = true;
        },
        ({ error }) => {  }
      )
    );
  }

  initBookingsFG() {
    this.bookingFG = this._fb.group({
      booking: [''],
    });
  }

  loadGuestRequests() {
    this.$subscription.add(
      this.requestService.getGuestRequestData(this.guestId).subscribe(
        (response) => (this.requestList = new Requests().deserialize(response))
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
