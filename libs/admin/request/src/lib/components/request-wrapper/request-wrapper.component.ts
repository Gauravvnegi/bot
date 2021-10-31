import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import { RaiseRequestComponent } from '../raise-request/raise-request.component';

@Component({
  selector: 'hospitality-bot-request-wrapper',
  templateUrl: './request-wrapper.component.html',
  styleUrls: ['./request-wrapper.component.scss'],
})
export class RequestWrapperComponent implements OnInit {
  private $subscription = new Subscription();
  tabFilterItems = [
    {
      label: 'In-House',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Pre-Arrival',
      content: '',
      value: 'PREARRIVAL',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

  tabFilterIdx: number = 0;

  constructor(private _modal: ModalService) {}

  ngOnInit(): void {}

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }

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
          raiseRequestCompRef.close();
        }
      )
    );
  }
}
