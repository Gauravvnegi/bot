import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { Subscription } from 'rxjs';
import { HeaderSummaryComponent } from '../header-summary/header-summary.component';

@Component({
  selector: 'hospitality-bot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  protected $subscription: Subscription = new Subscription();
  @Input() headerName: string;
  headerLogo: string = 'assets/logo.png';
  headerData = {};
  isCustomHeader: boolean = false;
  protected summaryComponent=HeaderSummaryComponent;
  constructor(
    protected _matDialog: MatDialog,
    protected _hotelService: HotelService
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

  openModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    const modalDialog = this._matDialog.open(
      this.summaryComponent,
      dialogConfig
    );

    this.$subscription.add(
      modalDialog.componentInstance.isRenderedEvent.subscribe((val) => {
        if (val === true) {
          modalDialog.componentInstance.showAppStatusForm = true;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
