import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Inhouse } from '../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../reservation-datatable-modal/reservation-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-inhouse-statistics',
  templateUrl: './inhouse-statistics.component.html',
  styleUrls: ['./inhouse-statistics.component.scss'],
})
export class InhouseStatisticsComponent implements OnInit {
  @Input() inhouse: Inhouse;

  percentStyle: string = '--percentage : 80; --fill: hsla(266, 90%, 54%, 1) ;';

  modalData = {
    tabFilterItems: [{
      label: 'Inhouse',
      content: '',
      value: 'INHOUSE',
      disabled: false,
      total: 0,
      chips: [],
      lastPage:0
    }],
    type: 'reservation',
  };
  constructor(
    private modalService: ModalService
  ) {}

  ngOnChanges() {
    this.setPercentageStyle();
  }

  ngOnInit(): void {
    // this.setPercentageStyle();
  }

  setPercentageStyle() {
    let percentage = Math.abs(
      (this.inhouse.roomOccupied / this.inhouse.totalRoom) * 100
    );
    this.percentStyle = `--percentage : ${percentage}; --fill: hsla(266, 90%, 54%, 1) ;`;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'In-House';
    detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }
}
