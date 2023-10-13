import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NightAuditService } from '../../services/night-audit.service';
import { itemList } from '../../constants/night-audit.const';
import { Subscription } from 'rxjs';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  CheckedInReservation,
  CheckedOutReservation,
  NightAudit,
} from './models/night-audit.model';

@Component({
  selector: 'night-audit',
  templateUrl: './night-audit.component.html',
  styleUrls: ['./night-audit.component.scss'],
})
export class NightAuditComponent implements OnInit {
  constructor(
    private nightAuditService: NightAuditService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private routesConfigService: RoutesConfigService
  ) {}
  @Input() isSidebar = true;
  @Output() onClose = new EventEmitter();
  pageTitle = 'Night Audit';
  currentDate = new Date();
  itemList = itemList;
  activeStep = 0;
  loading = false;
  entityId: string;

  // Manage logged config
  usersLoggedOut = false;
  $subscription = new Subscription();

  // DataList
  checkedInReservation: CheckedInReservation[] = [];
  checkedOutReservation: CheckedOutReservation[] = [];

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
  }

  initData() {
    this.loading = true;
    this.$subscription.add(
      this.nightAuditService
        .getNightAudit(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const {
              checkedInReservation,
              checkedOutReservation,
            } = new NightAudit().deserialize(res);
            this.checkedOutReservation = checkedOutReservation;
            this.checkedInReservation = checkedInReservation;
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  close(event?: boolean) {
    this.onClose.emit(false);
  }

  finish(event) {
    if (typeof event == 'number') {
      this.close();
    } else {
      this.activeStep = event.index;
    }
  }

  getQueryConfig(): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          auditDate: new Date().getTime(),
        },
      ]),
    };
  }

  /**
   * @function onNavigate To navigate to the edit page
   */
  onNavigate(event) {
    this.onClose.emit(true);
    this.routesConfigService.navigate({
      subModuleName: event.subModuleName,
      additionalPath: event.additionalPath,
      queryParams: {
        entityId: this.entityId,
      },
    });
  }
}
