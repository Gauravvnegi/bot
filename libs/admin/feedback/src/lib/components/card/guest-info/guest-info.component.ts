import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Guest,
  GuestDetails,
} from 'libs/admin/request/src/lib/data-models/request.model';
import { CardService } from '../../../services/card.service';
@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges {
  isGuestReservationFetched = false;
  guestReservations: GuestDetails;
  guestId: string;
  data;
  @Output() closeInfo = new EventEmitter();
  @Output() onDetailsClose = new EventEmitter();
  bookingFG: FormGroup;
  @Input() feedback;

  @ViewChild('matTab') matTab: MatTabGroup;
  $subscription = new Subscription();

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
  guestData: Guest;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _snackBarService: SnackBarService,
    private feedbackService: CardService,
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

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
      })
    );
  }

  listenForSelectedRequest() {
    this.$subscription.add(
      this.feedbackService.$selectedFeedback.subscribe((response) => {
        if (response) {
          this.data = response;
          this.guestId = response['feedback']?.guest?.id;
          this.loadGuestInfo();
        }
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }

  onTabChanged(event) {
    this.selectedIndex = event.index;
  }

  handleButtonCLick(): void {
    switch (this.selectedIndex) {
      case 0:
        break;
      case 1:
        break;
    }
  }

  closeDetails() {
    this.onDetailsClose.next(true);
  }

  loadGuestInfo(): void {
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
          this.guestReservations = new GuestDetails().deserialize(
            response,
            this.colorMap
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
