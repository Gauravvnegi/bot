import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { UserPermissionTable } from 'libs/admin/roles-and-permissions/src/lib/models/user-permission-table.model';
import { MenuItem } from 'primeng/api';
import { Subscription, timer } from 'rxjs';
import { NightAuditService } from '../../../../services/night-audit.service';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { cols, title } from '../../constants/manage-login.table';
import { LoggedInUsers } from '../../models/logged-users.model';

@Component({
  selector: 'hospitality-bot-manage-logged-users',
  templateUrl: './manage-logged-users.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './manage-logged-users.component.scss',
  ],
})
export class ManageLoggedUsersComponent implements OnInit {
  entityId: string;
  title = title;
  cols = cols;
  loading = false;
  hasError = false;
  actionConfig: ActionConfigType;
  usersLoggedOut: boolean;
  isTimerStart = false;

  @Input() items: LoggedInUsers[];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() onCheckAudit = new EventEmitter<boolean>();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenLoading();
    this.initAction(); // TODO: Replace with @function initActionConfig();, after forcefully loggin implement
    this.initTable();
    this.checkAudit();
  }

  /**
   * TODO: Remove after forcefully loggin implement
   */
  initAction() {
    this.usersLoggedOut = false;
    this.isTimerStart = true;
    this.initActionConfig('Next');
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: postLabel
        ? postLabel
        : this.activeIndex == 0
        ? 'Forcefully Logout Users >'
        : 'Next',
      preSeverity: 'primary',
      postDisabled: this.hasError,
    };
  }

  initTable() {
    this.loading = true;
    this.$subscription.add(
      this.nightAuditService
        .getAllUsers(this.entityId, this.getQueryConfig())
        .subscribe(
          (loggedUsers) => {
            const users = new UserPermissionTable().deserialize(loggedUsers)
              .records;
            this.items = users.map((user) => new LoggedInUsers(user));
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  checkAudit() {
    this.onCheckAudit.emit(true);
  }

  listenLoading() {
    this.$subscription.add(
      this.nightAuditService.$manageLoggedInLoading.subscribe((res) => {
        this.loading = res.loading;
        this.hasError = res.error;
        this.initActionConfig('Next');
      })
    );
  }

  reloadTable() {
    this.initTable();
    this.checkAudit();
  }

  handleNext() {
    if (this.items?.length && !this.isTimerStart && this.activeIndex == 0) {
      this.handleMangeLoggedIn();
    } else if (this.activeIndex + 1 < this.stepList?.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }

  /**
   * @function handleMangeLoggedIn mange logged-in component actions
   */
  handleMangeLoggedIn() {
    this.usersLoggedOut = true;
    this.isTimerStart = true;
    const targetTime = Date.now() + 2 * 1000; //Date.now() + 5 * 60 * 1000; //<=== 5 Minute
    // Update the display every second
    timer(0, 1000).subscribe(() => {
      const now = Date.now();
      const remainingTime = targetTime - now;

      if (remainingTime <= 0) {
        this.initActionConfig('Next');
        this.usersLoggedOut = false;
        this.items = [];
      } else {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        this.initActionConfig(
          `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        );
      }
    });
  }

  getQueryConfig(): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          loggedInUser: true,
        },
      ]),
    };
  }
}
