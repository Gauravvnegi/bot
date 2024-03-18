import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AdminUtilityService,
  UserService,
  openModal,
} from 'libs/admin/shared/src/index';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {
  Notification,
  NotificationList,
} from '../../data-models/notifications.model';
import { GlobalFilterService } from '../../services/global-filters.service';
import { FirebaseMessagingService } from '../../services/messaging.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notificationFilterData;
  @Output() onCloseNotification = new EventEmitter();
  @Output() filterData = new EventEmitter();

  scrollView;
  filterFG: FormGroup;
  isCustomizeVisible = false;
  isFilterVisible = false;

  limit = 20;
  limitDelimiter = 20;
  paginationDisabled = false;

  notifications: Notification[];
  private $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private adminUtilityService: AdminUtilityService,
    public userService: UserService,
    public globalFilterService: GlobalFilterService,
    private firebaseMessagingService: FirebaseMessagingService,
    private dialogService: DialogService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    // this.getNotifications();
    this.listenForNewNotification();
  }

  listenForNewNotification() {
    this.$subscription.add(
      this.firebaseMessagingService.$receivedNewNotification.subscribe((_) =>
        this.getNotifications()
      )
    );
  }

  initFG(): void {
    this.filterFG = this.fb.group({
      status: this.fb.group({
        read: [false],
        unread: [false],
        removed: [false],
      }),
      fromDate: [''],
      toDate: [''],
    });
  }

  /**
   * Get notification
   * @param isRefresh is used to get the last call param state
   * @example when openNotifications
   *
   */
  getNotifications(isRefresh = false) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          limit:
            this.limit -
            (!this.paginationDisabled &&
            isRefresh &&
            this.limit > this.limitDelimiter
              ? this.limitDelimiter
              : 0),
          ...this.notificationFilterData,
        },
      ]),
    };
    this.$subscription.add(
      this.notificationService
        .getNotificationHistory(this.userService.getLoggedInUserId(), config)
        .subscribe((response) => {
          this.notifications = new NotificationList().deserialize(response);

          if (!isRefresh) {
            this.paginationDisabled = response.length < this.limit;
            this.limit = this.paginationDisabled
              ? this.limit
              : (this.limit = this.limit + this.limitDelimiter);
          }
        })
    );
  }

  closePopup() {
    let data = this.notificationFilterData;
    data.fromDate = data.fromDate
      ? moment(data.fromDate).unix() * 1000
      : data.fromDate;
    data.toDate = data.toDate ? moment(data.toDate).unix() * 1000 : data.toDate;
    data.status = Object.keys(data.status)
      .map((key) => (data.status[key] ? key : ''))
      .filter((label) => label !== '');
    this.onCloseNotification.emit();
  }

  handleCustomize(event) {
    event.stopPropagation();
    this.isCustomizeVisible = true;
  }

  deleteNotification(event, item: Notification) {
    event.stopPropagation();
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([{ id: item.id }]),
    };
    this.$subscription.add(
      this.notificationService
        .deleteNotification(this.userService.getLoggedInUserId(), config)
        .subscribe((_) => this.getNotifications())
    );
  }

  dismisAll() {
    if (this.notifications?.length) {
      const config = {
        queryObj: '',
      };
      this.$subscription.add(
        this.notificationService
          .deleteNotification(this.userService.getLoggedInUserId(), config)
          .subscribe((_) => this.getNotifications())
      );
    }
  }

  handleApplyFilter(event) {
    if (event.status) {
      this.notificationFilterData = event.data;
      this.filterData.emit({ data: event.data });
      this.getNotifications();
    }
    this.isFilterVisible = false;
  }

  openFilterForm() {
    if (!this.isFilterVisible) {
      let data = JSON.parse(JSON.stringify(this.notificationFilterData));
      data.fromDate = data.fromDate ? moment(data.fromDate) : data.fromDate;
      data.toDate = data.toDate ? moment(data.toDate) : data.toDate;
      if (!('read' in data.status)) {
        const status = {
          read: data.status.includes('READ'),
          unread: data.status.includes('UNREAD'),
          removed: data.status.includes('REMOVED'),
        };
        data.status = status;
      }
      this.filterFG.patchValue(data);
      this.isFilterVisible = true;
      this.isCustomizeVisible = false;
    }
  }

  handleCustomizeClose() {
    this.isCustomizeVisible = false;
    this.getNotifications();
  }

  openNotifications(event, item) {
    event.stopPropagation();
    this.$subscription.add(
      this.notificationService
        .updateNotificationStatus(this.userService.getLoggedInUserId(), item.id)
        .subscribe((_) => this.getNotifications(true))
    );
    this.openNotificationDetail(item);
  }

  openNotificationDetail(item: Notification) {
    const dialogRef = openModal({
      component: NotificationDetailComponent,
      config: {
        width: '550px',
        styleClass: 'confirm-dialog',
        data: item,
      },
      dialogService: this.dialogService,
    });
    dialogRef.onClose.subscribe((response) => {
      // if (response.close) dialogRef.close();
      if (response?.notificationClose) this.closePopup();
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
