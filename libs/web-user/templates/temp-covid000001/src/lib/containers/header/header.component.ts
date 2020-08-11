import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RaiseRequestWrapperComponent } from '../raise-request-wrapper/raise-request-wrapper.component';
import { HyperlinkElementService } from '../../../../../../shared/src/lib/services/hyperlink-element.service';
import { debug } from 'util';

@Component({
  selector: 'hospitality-bot-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  status:boolean=false

  toggleMenuButton(){
     this.status=!this.status;
  }

  constructor(
    public dialog: MatDialog,
    public _hyperlink: HyperlinkElementService
  ) { }

  ngOnInit(): void {
  }

  openDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(RaiseRequestWrapperComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  setHyperLinkElement(element) {
    this._hyperlink.setSelectedElement(element);
  }
}
