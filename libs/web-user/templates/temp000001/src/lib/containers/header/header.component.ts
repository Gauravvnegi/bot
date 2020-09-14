import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StatusComponent } from '../status/status.component';
import { SummaryComponent } from '../summary/summary.component';
import { HeaderSummaryComponent } from '../header-summary/header-summary.component';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerName;
  headerLogo = 'assets/logo.png';
  status = 'Status:';
  headerData = {};
  isCustomHeader: boolean = false;
  constructor(
    private _matDialog: MatDialog,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.getCurentJourneyConfig();
  }

  getCurentJourneyConfig() {
    let { title } = this._hotelService.getCurrentJourneyConfig();
    let { logo } = this._hotelService.hotelConfig;
    this.headerLogo = logo;
    this.isCustomHeader = !!this.headerName;
    this.headerName = this.headerName || title;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '70vw';
    const modalDialog = this._matDialog.open(
      HeaderSummaryComponent,
      dialogConfig
    );

    modalDialog.componentInstance.isRenderedEvent.subscribe((val) => {
      if (val === true) {
        modalDialog.componentInstance.showAppStatusForm = true;
      }
    });
  }
}
