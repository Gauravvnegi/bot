import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RaiseRequestWrapperComponent } from '../raise-request-wrapper/raise-request-wrapper.component';
import { HyperlinkElementService } from '../../../../../../shared/src/lib/services/hyperlink-element.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  status = false;

  toggleMenuButton() {
    this.status = !this.status;
  }

  constructor(
    public dialog: MatDialog,
    private _hotelService: HotelService,
    public _hyperlink: HyperlinkElementService
  ) {}

  ngOnInit(): void {
    this.hotelLogo;
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(
      RaiseRequestWrapperComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setHyperLinkElement(element) {
    if (element) {
      this._hyperlink.setSelectedElement(element);
    } else {
      window.scrollTo(0, 0);
    }
  }

  get hotelLogo() {
    return (
      this._hotelService.hotelConfig && this._hotelService.hotelConfig.logo
    );
  }
}
