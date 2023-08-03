import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import { request } from '../../constants/request';
import { RequestService } from '../../services/request.service';
import { RaiseRequestComponent } from '../raise-request/raise-request.component';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';

@Component({
  selector: 'hospitality-bot-request-wrapper',
  templateUrl: './request-wrapper.component.html',
  styleUrls: ['./request-wrapper.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class RequestWrapperComponent implements OnInit, OnDestroy {
  pageTitle = 'Complaints';
  guestInfoEnable = false;
  private $subscription = new Subscription();
  requestConfig = request;
  tabFilterItems = [
    {
      label: 'In-House',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      chips: [],
    },
  ];

  tabFilterIdx = 0;

  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Raise Complaint', icon: 'assets/svg/requests.svg' },
  ];

  constructor(
    private _modal: ModalService,
    private _requestService: RequestService,
    private _globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {}

  get hasComplaintManagementSystem() {
    return this.subscriptionService.hasComplaintManagementSystem();
  }

  /**
   * @function onSelectedTabFilterChange To handle tab filter change.
   * @param event The tab filter change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
  }

  openGuestInfo(event) {
    if (event.openGuestInfo) {
      this.guestInfoEnable = true;
    }
  }

  closeGuestInfo(event) {
    if (event.close) {
      this.guestInfoEnable = false;
    }
  }

  syncRequest() {
    this.$subscription.add(
      this._requestService
        .syncRequest(this._globalFilterService.entityId)
        .subscribe((res) => {
          this.snackbarService.openSnackBarAsText(`Syncing successful`, '', {
            panelClass: 'success',
          });
          this._globalFilterService.globalFilter$.next(
            this._globalFilterService.globalFilterObj
          );
        })
    );
  }

  /**
   * @function openRaiseRequest To open raise request modal.
   */
  openRaiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '90vh';

    const raiseRequestCompRef = this._modal.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          if (res.load) this._requestService.refreshData.next(res.load);
          raiseRequestCompRef.close();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
