import { Component, OnInit, Optional, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'web-user-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  onSubmitEvent = new EventEmitter();

  dialaogData: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    //this.dialaogData = data.pageValue;
   }

  ngOnInit(): void {
  }

  submit(){
    this.onSubmitEvent.emit('submit');
  }

  close() {
    this.dialogRef.close({ event: 'close' });
  }
}
