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
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Guest, GuestDetails, Requests } from '../../data-models/request.model';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges, OnDestroy {
  guestReservations: GuestDetails;
  guestId: string;
  data;
  @Output() closeInfo = new EventEmitter();
  @Output() onDetailsClose = new EventEmitter();
  bookingFG: FormGroup;

  @ViewChild('matTab') matTab: MatTabGroup;
  $subscription = new Subscription();
  guestData;
  loadingGuests = false;
  loadingReservations = false;
  loadingRequests = false;
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
    private requestService: RequestService,
    private _fb: FormBuilder
  ) {}

  ngOnChanges() {}

  ngOnInit(): void {
    this.listenForSelectedRequest();
  }

  listenForSelectedRequest() {
    this.$subscription.add(
      this.requestService.selectedRequest.subscribe((response) => {
        if (response) {
          this.data = response;
          this.guestId = response['guestDetails']?.primaryGuest?.id
            ? response['guestDetails']?.primaryGuest?.id
            : response?.guest?.id;
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
    if (!this.guestId) {
      this.guestData = undefined;
      this.guestReservations = undefined;
      return;
    }

    this.loadingGuests = true;
    this.loadingReservations = true;
    this.$subscription.add(
      this.requestService.getGuestById(this.guestId).subscribe(
        (response) => {
          this.guestData = new Guest().deserialize(response);
          this.loadGuestReservations();
          this.loadingGuests = false;
        },
        ({ error }) => {
          this.closeDetails();
          this.loadingGuests = false;
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
          this.loadingReservations = false;
        },
        ({ error }) => {
          this.loadingReservations = false;
        }
      )
    );
  }

  initBookingsFG() {
    this.bookingFG = this._fb.group({
      booking: [''],
    });
  }

  loadGuestRequests() {
    if (!this.guestId) {
      this.requestList = [];
      return;
    }
    this.loadingRequests = true;
    this.$subscription.add(
      this.requestService.getGuestRequestData(this.guestId).subscribe(
        (response) => {
          this.requestList = new Requests().deserialize(response);
          this.loadingRequests = false;
        },
        ({ error }) => {
          this.loadingRequests = false;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
