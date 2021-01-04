import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Details } from '../../../../../shared/src/lib/models/detailsConfig.model';
import { GuestTableService } from '../../services/guest-table.service';

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
  detailsFG: FormGroup;
  details;
  reservationDetails;
  primaryGuest;

  @Output() onDetailsClose = new EventEmitter();

  constructor(
    private guestTableService: GuestTableService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initFG();
    this.loadGuestReservations();
  }

  loadGuestReservations(): void {
    this.guestTableService.getGuestReservations(this.guestId)
      .subscribe((response) => {
        this.details = response;
        this.getBookingDetails();
      });
  }

  getBookingDetails(): void {
    this.guestTableService.getReservationDetail(this.bookingId)
      .subscribe((response)=> {
        this.reservationDetails = new Details().deserialize(response);
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

  guestInfoPatched(data: boolean) {
    if (data) {
      const guestFA = this.detailsFG
        .get('guestInfoDetails')
        .get('guests') as FormArray;
      guestFA.controls.forEach((guestFG) => {
        if (guestFG.get('isPrimary').value === true) {
          this.primaryGuest = guestFG.value;
        }
      });
      this.isGuestInfoPatched = true;
      this.changeDetectorRef.detectChanges();
    }
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }
}
