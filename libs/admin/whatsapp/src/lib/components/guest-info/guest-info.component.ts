import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
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
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { openModal } from '@hospitality-bot/admin/shared';
import { DialogService } from 'primeng/dynamicdialog';

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
    private messageService: MessageService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForRefreshData();
    this.listenForGlobalFilters();
    if (this.entityId) {
      this.getGuestInfo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue && !changes.data.firstChange) {
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
          } else {
            this.getRequestList();
          }
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
      requests: this.messageService.getRequestByPhoneNumber(
        this.guestData?.phone
      ),
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
    this.$subscription.add(
      this.messageService
        .getRequestByPhoneNumber(this.guestData?.phone)
        .subscribe((response) => {
          this.requestList = new RequestList().deserialize(response).data;
        })
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
    openModal({
      config: {
        styleClass: 'dynamic-modal',
        width: '50%',
        data: { data: this.data },
      },
      component: GuestDetailMapComponent,
      dialogService: this.dialogService,
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
