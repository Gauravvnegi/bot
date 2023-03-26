import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import { request } from '../../constants/request';
import { RequestService } from '../../services/request.service';
import { RaiseRequestComponent } from '../raise-request/raise-request.component';
import { trigger, transition, animate, style } from '@angular/animations';

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
  guestInfoEnable = false;
  private $subscription = new Subscription();
  requestConfig = request;
  tabFilterItems = [
    {
      label: 'In-House',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

  tabFilterIdx = 0;

  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Raise Request', icon: 'assets/svg/requests.svg' },
  ];

  constructor(
    private _modal: ModalService,
    private _requestService: RequestService
  ) {}

  ngOnInit(): void {}

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

  /**
   * @function openRaiseRequest To open raise request modal.
   */
  openRaiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    const raiseRequestCompRef = this._modal.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          if (res.status) this._requestService.refreshData.next(res);
          raiseRequestCompRef.close();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
