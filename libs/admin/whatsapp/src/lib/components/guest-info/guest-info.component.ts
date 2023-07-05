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
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { MessageService } from '../../services/messages.service';
import { GuestDetailMapComponent } from '../guest-detail-map/guest-detail-map.component';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { forkJoin, Subscription } from 'rxjs';
import {
  Contact,
  GuestDetails,
  IContact,
  RequestList,
} from '../../models/message.model';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  @Output() closeInfo = new EventEmitter();
  @ViewChild('matTab') matTab: MatTabGroup;
  $subscription = new Subscription();
  guestReservations: GuestDetails;
  colorMap: any;
  guestId: string;
  guestData: IContact;
  entityId: string;
  isLoading = false;
  selectedTab = 0;
  requestList;

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForRefreshData();
    this.listenForGlobalFilters();
  }

  ngOnChanges() {
    if (this.entityId) {
      this.getGuestInfo();
    }
  }

  getGuestInfo() {
    this.isLoading = true;
    this.$subscription.add(
      this.messageService
        .getChat(this.entityId, this.data.receiverId, '')
        .subscribe((response) => {
          this.guestData = new Contact().deserialize(
            response.receiver,
            this.globalFilterService.timezone
          );
          if (this.guestData.reservationId) {
            this.guestId = this.guestData.guestId;
            this.getRequestAndReservation();
          } else this.requestList = [];
          this.isLoading = false;
        })
    );
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        this.getGuestInfo();
      })
    );
  }

  listenForRefreshData() {
    this.messageService.refreshData$.subscribe((response) => {
      if (response) {
        this.getGuestInfo();
        this.messageService.refreshData$.next(false);
      }
    });
  }

  getRequestAndReservation() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityId: this.entityId,
          confirmationNumber: this.data.reservationId,
        },
      ]),
    };
    forkJoin({
      requests: this.messageService.getRequestByConfNo(config),
      reservations: this.messageService.getGuestReservations(this.guestId),
    }).subscribe(
      (response) => {
        this.requestList = new RequestList().deserialize(
          response.requests
        ).data;
        this.guestReservations = new GuestDetails().deserialize(
          response.reservations,
          this.colorMap
        );
      },
      ({ error }) => {
        this.snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  getRequestList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityId: this.entityId,
          confirmationNumber: this.data.reservationId,
        },
      ]),
    };
    this.$subscription.add(
      this.messageService.getRequestByConfNo(config).subscribe(
        (response) =>
          (this.requestList = new RequestList().deserialize(response).data)
      )
    );
  }

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }

  onTabChanged(event) {
    this.selectedTab = event.index;
    console.log(this.selectedTab);
  }

  handleButtonCLick(): void {
    this.updateGuestDetails();
  }

  updateGuestDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    const detailCompRef = this.modalService.openDialog(
      GuestDetailMapComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.data = this.data;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      detailCompRef.close();
    });
  }

  openRaiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    const raiseRequestCompRef = this.modalService.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          if (res.status) {
            this.getRequestList();
            const values = {
              reservationId: res.data.number,
            };
            this.$subscription.add(
              this.messageService
                .updateGuestDetail(this.entityId, this.data.receiverId, values)
                .subscribe(
                  (response) => {
                    this.messageService.refreshData$.next(true);
                  }                  
                )
            );
          }
          raiseRequestCompRef.close();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
