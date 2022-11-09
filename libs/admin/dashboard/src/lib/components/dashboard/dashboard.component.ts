import { Location } from '@angular/common';
import { Component, OnInit, ComponentRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';
import { ModalService } from '@hospitality-bot/shared/material';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { TableNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { Subscription } from 'rxjs';
import { Reservation } from '../../data-models';

@Component({
  selector: 'hospitality-bot-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tables = TableNames;
  private $subscription = new Subscription();
  constructor(
    private location: Location,
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.listenForStateData();
  }

  listenForStateData() {
    const stateData = this.location.getState();
    if (stateData['reservationId']) {
      this.$subscription.add(
        this.reservationService
          .getReservationDetails(stateData['reservationId'])
          .subscribe((response) => {
            const data = new Reservation().deserialize(
              response,
              this.globalFilterService.timezone
            );
            this.openDetailPage(data);
          })
      );
    }
  }

  openDetailPage(rowData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.guestId = rowData.guests.primaryGuest.id;
    detailCompRef.componentInstance.bookingNumber =
      rowData.booking.bookingNumber;

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((_) => {
        detailCompRef.close();
      })
    );
  }
}
