import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Arrivals } from '../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../reservation-datatable-modal/reservation-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-statistics.component.html',
  styleUrls: ['./arrivals-statistics.component.scss'],
})
export class ArrivalsStatisticsComponent implements OnInit {
  @Input() arrivals: Arrivals;

  progress: number = 0;
  constructor(private modalService: ModalService) {}

  modalData = {
    tabFilterItems: [
      {
        label: 'Arrival',
        content: '',
        value: 'ARRIVAL',
        disabled: false,
        total: 0,
        chips: [
          { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
          { label: 'New', icon: '', value: 'NEW', total: 0, isSelected: false },
          {
            label: 'Precheckin_Pending ',
            icon: '',
            value: 'PRECHECKINPENDING',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
          {
            label: 'Precheckin_Initiated ',
            icon: '',
            value: 'PRECHECKININITIATED',
            total: 0,
            isSelected: false,
            type: 'initiated',
          },
          {
            label: 'Precheckin_Complete ',
            icon: '',
            value: 'PRECHECKINCOMPLETE',
            total: 0,
            isSelected: false,
            type: 'completed',
          },
          {
            label: 'Precheckin_Failed',
            icon: '',
            value: 'PRECHECKINFAILED',
            total: 0,
            isSelected: false,
            type: 'failed',
          },
          {
            label: 'CheckIn_Pending',
            icon: '',
            value: 'CHECKINPENDING',
            total: 0,
            isSelected: false,
            type: 'pending',
          },
          {
            label: 'CheckIn_Initiated',
            icon: '',
            value: 'CHECKININITIATED',
            total: 0,
            isSelected: false,
            type: 'initiated',
          },
          {
            label: 'CheckIn_Complete',
            icon: '',
            value: 'CHECKINCOMPLETE',
            total: 0,
            isSelected: false,
            type: 'completed',
          },
          {
            label: 'CheckIn_Failed',
            icon: '',
            value: 'CHECKINFAILED',
            total: 0,
            isSelected: false,
            type: 'failed',
          },
        ],
      },
    ],
    type: 'reservation',
  };

  ngOnChanges() {
    this.setProgress();
  }

  ngOnInit(): void {
    //  this.setProgress();
  }

  setProgress() {
    if (this.arrivals.maxExpected) {
      this.progress = Math.abs(
        (this.arrivals.currentlyArrived / this.arrivals.maxExpected) * 100
      );
    } else {
      this.progress = 0;
    }
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'Arrivals';
    detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }
}
