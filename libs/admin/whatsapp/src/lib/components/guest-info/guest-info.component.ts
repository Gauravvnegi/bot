import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { Subscription } from 'rxjs';
import { Contact, GuestDetails, IContact, RequestList } from '../../models/message.model';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit, OnChanges {
  @Input() data;
  @Output() closeInfo = new EventEmitter();
  @ViewChild('matTab') matTab: MatTabGroup;
  $subscription = new Subscription();
  guestReservations: GuestDetails;
  colorMap: any;
  guestId :string;
  guestData: IContact;
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
  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private _globalFilterService: GlobalFilterService,
    private snackBarService: SnackBarService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForRefreshData();
    this.listenForGlobalFilters();
  }

  ngOnChanges() {
    if (this.hotelId) {
      this.getGuestInfo();
    }
  }

  getGuestInfo() {
    this.isLoading = true;
    this.$subscription.add(
      this.messageService
        .getChat(this.hotelId, this.data.receiverId, '')
        .subscribe((response) => {
          this.guestData = new Contact().deserialize(
            response.receiver,
            this._globalFilterService.timezone
          );
          if (this.guestData.reservationId) this.getRequestList();
          else this.requestList = [];
          this.isLoading = false;
        })
    );
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

  listenForRefreshData() {
    this.messageService.refreshData$.subscribe((response) => {
      if (response) {
        this.getGuestInfo();
        this.messageService.refreshData$.next(false);
      }
    });
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
        this.getGuestInfo();
      }
    });
  }

  getRequestList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          hotelId: this.hotelId,
          confirmationNumber: this.data.reservationId,
        },
      ]),
    };
    this.$subscription.add(
      this.messageService.getRequestByConfNo(config).subscribe(
        (response) => {
          debugger
          this.requestList = new RequestList().deserialize(response).data;
          this.guestId = this.requestList[0].guestDetails?.primaryGuest?.id;
          this.loadGuestReservations();
        },
        ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
      )
    );
  }

  loadGuestReservations(): void {
    this.$subscription.add(
      this.messageService.getGuestReservations(this.guestId).subscribe(
        (response) => {
          debugger;
          this.guestReservations = new GuestDetails().deserialize(
            response,
            this.colorMap
          );
        },
        ({ error }) => {
          this.snackBarService.openSnackBarAsText(error.message);
        }
      )
    );
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
        this.updateGuestDetails();
        break;
      case 1:
        this.updateGuestDetails();
        break;
    }
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
      // remove loader for detail close
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
                .updateGuestDetail(this.hotelId, this.data.receiverId, values)
                .subscribe(
                  (response) => {
                    this.messageService.refreshData$.next(true);
                  },
                  ({ error }) =>
                    this.snackBarService.openSnackBarAsText(error.message)
                )
            );
          }
          raiseRequestCompRef.close();
        }
      )
    );
  }

}
