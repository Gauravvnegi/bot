import {
  Component,
  EventEmitter,
  Input,
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardService } from '../../../services/card.service';
import { card } from '../../../constants/card';
import { Guest } from 'libs/admin/request/src/lib/data-models/request.model';
import {
  GuestDetail,
  GuestDetails,
} from '../../../data-models/guest-feedback.model';
@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('matTab') matTab: MatTabGroup;
  @Input() feedback;
  @Input() guestModalData;
  @Input() colorMap: any;
  @Input() isModal = false;
  @Output() closeInfo = new EventEmitter();
  @Output() onDetailsClose = new EventEmitter();
  isGuestReservationFetched = false;
  guestReservations: GuestDetail[];
  guestFeedback: GuestDetail[];
  guestId: string;
  data;
  bookingFG: FormGroup;
  $subscription = new Subscription();
  isLoading = false;
  selectedIndex = 0;
  requestList;
  buttonConfig = card.buttonConfig;
  guestData: Guest;
  constructor(
    private _snackBarService: SnackBarService,
    private feedbackService: CardService,
    private _fb: FormBuilder
  ) {}

  ngOnChanges() {}

  ngOnInit(): void {
    if (this.isModal) {
      this.data = this.guestModalData;
      this.guestId = this.guestModalData.guest?.id;
      this.loadGuestInfo();
    } else {
      this.registerListeners();
    }
  }

  registerListeners(): void {
    this.listenForSelectedRequest();
  }

  listenForSelectedRequest() {
    this.$subscription.add(
      this.feedbackService.$selectedFeedback.subscribe((response) => {
        if (response) {
          this.data = response;
          this.guestId = response['feedback'].guest
            ? response['feedback'].guest?.id
            : response.guest.id;
          this.loadGuestInfo();
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
    if (this.isModal) {
      this.guestId = this.guestModalData.guest.id;
    }
    this.$subscription.add(
      this.feedbackService.getGuestById(this.guestId).subscribe(
        (response) => {
          this.guestData = new Guest().deserialize(response);
          this.loadGuestReservations();
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this.closeDetails();
        }
      )
    );
  }

  loadGuestReservations(): void {
    this.$subscription.add(
      this.feedbackService.getGuestReservations(this.guestId).subscribe(
        (response) => {
          debugger;
          const data = new GuestDetails().deserialize(response, this.colorMap);
          this.guestReservations = data.records.filter(
            (item) => item.type === 'RESERVATION'
          );
          this.guestFeedback = data.records.filter(
            (item) => item.type !== 'RESERVATION'
          );
          this.isGuestReservationFetched = true;
        },
        ({ error }) => {
          this._snackBarService.openSnackBarAsText(error.message);
          this.closeDetails();
        }
      )
    );
  }

  initBookingsFG() {
    this.bookingFG = this._fb.group({
      booking: [''],
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
