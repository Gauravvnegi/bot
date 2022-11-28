import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  DetailsComponent,
  Reservation,
} from '@hospitality-bot/admin/reservation';
import { ModalService } from '@hospitality-bot/shared/material';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { TableNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  tables = TableNames;
  private $subscription = new Subscription();
  constructor(
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.listenForStateData();
  }

  listenForStateData(): void {
    this.$subscription.add(
      this.notificationService.$reservationNotification.subscribe(
        (response) => {
          if (response) {
            this.reservationService
              .getReservationDetails(response)
              .subscribe((response) => {
                const data = new Reservation().deserialize(
                  response,
                  this.globalFilterService.timezone
                );
                this.openDetailPage(data);
              });
            this.notificationService.$reservationNotification.next(null);
          }
        }
      )
    );
  }

  openDetailPage(rowData): void {
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
