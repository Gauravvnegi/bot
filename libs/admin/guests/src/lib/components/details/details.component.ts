import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { GuestTableService } from '../../services/guest-table.service';
import { Reservation, GuestReservation } from '../../data-models/guest-table.model';
import { get } from 'lodash';

@Component({
  selector: 'hospitality-bot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  
  isReservationDetailFetched: boolean = false;
  isGuestInfoPatched: boolean = false;
  @Input() guestId;
  @Input() bookingId;
  @Input() data: Reservation;
  @Input() tabKey = 'guest_details';
  detailsFG: FormGroup;
  details: GuestReservation;
  reservationData;

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
    private guestTableService: GuestTableService,
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.loadGuestReservations();
  }

  loadGuestReservations(): void {
    this.guestTableService.getGuestReservations(this.guestId)
      .subscribe((response) => {
        this.details = new GuestReservation().deserialize(response);
        this.initFG();
        this.loadReservation();
      });
  }

  loadReservation(): void {
    this.guestTableService.getReservationDetail(this.bookingId)
      .subscribe((response) => {
        this.reservationData = new Reservation().deserialize(response);
        this.isReservationDetailFetched = true;
      })
  }

  initFG(): void {
    this.detailsFG = this.fb.group({
      stayDetails: this.fb.group({}),
      documents: this.fb.group({}),
      guestDetails: this.fb.group({})
    });
  }

  addFGEvent(data) {
    this.detailsFG.setControl(data.name, data.value);
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  gotoStayDetails() {
    // this.tabIndex = 2;
  }

  get primaryGuest() {
    return this.reservationData.guests.primaryGuest;
  }

  get guestAttributes() {
    return this.data.guestAttributes;
  }

  get feedback() {
    return this.reservationData.feedback;
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

  get tabIndex() {
    let { index } = this.detailsConfig.find(
      (tabConfig) => tabConfig.key == this.tabKey
    );
    return index ? index : 0;
  }
}
