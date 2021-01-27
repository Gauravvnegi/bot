import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Departures } from '../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../reservation-datatable-modal/reservation-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-departure-statistics',
  templateUrl: './departure-statistics.component.html',
  styleUrls: ['./departure-statistics.component.scss']
})
export class DepartureStatisticsComponent implements OnInit {

  @Input() departures: Departures;
  modalData = {
    tabFilterItems: [
      {
        label: 'Departure',
        content: '',
        value: 'DEPARTURE',
        disabled: false,
        total: 0,
        chips: [
          { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
          {
            label: 'Checkout_Pending',
            icon: '',
            value: 'CHECKOUTPENDING',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
          {
            label: 'Checkout_Initiated',
            icon: '',
            value: 'CHECKOUTINITIATED',
            total: 0,
            isSelected: false,
            type: 'initiated',
          },
          {
            label: 'CheckOut_Completed',
            icon: '',
            value: 'CHECKOUTCOMPLETED',
            total: 0,
            isSelected: false,
            type: 'completed',
          },
          {
            label: 'Checkout_Failed',
            icon: '',
            value: 'CHECKOUTFAILED',
            total: 0,
            isSelected: false,
            type: 'failed',
          },
        ],
      }
    ],
    type: 'reservation',
  };
  
  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }

}
