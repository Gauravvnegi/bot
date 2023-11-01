import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
  requestTabFilterIdx = 0;

  listByFilterItems = [
    {
      label: 'Focused',
      value: 'FOCUSED',
    },
    {
      label: 'Other',
      value: 'ALL',
    },
  ];

  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Raise Complaint', icon: 'assets/svg/requests.svg' },
  ];

  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  sidebarVisible: boolean = false;
  sidebarType;

  constructor(
    private _modal: ModalService,
    private _requestService: RequestService,
    private _globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private subscriptionService: SubscriptionPlanService,
    private resolver: ComponentFactoryResolver
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

  onTabFilterChange(event) {
    this._requestService.requestListFilter.next(
      this.listByFilterItems[event.index].value
    );
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
    this.sidebarVisible = true;
    this.sidebarType = 'complaint';

    const factory = this.resolver.resolveComponentFactory(
      RaiseRequestComponent
    );
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    componentRef.instance.isSideBar = true;
    componentRef.instance.onRaiseRequestClose.subscribe((res) => {
      this.sidebarVisible = false;
      componentRef.destroy();
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
