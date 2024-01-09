import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-orientation-popup',
  templateUrl: './orientation-popup.component.html',
  styleUrls: ['./orientation-popup.component.scss'],
})
export class OrientationPopupComponent implements OnInit {
  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {
    /**
     * @remark extracting data from dialog config
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
