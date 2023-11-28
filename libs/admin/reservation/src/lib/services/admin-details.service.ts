import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { JourneyDialogComponent } from '../components';

@Injectable()
export class AdminDetailsService {
  constructor(public modal: ModalService) {}

  openJourneyDialog(config) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    const journeyDialogCompRef = this.modal.openDialog(
      JourneyDialogComponent,
      dialogConfig
    );

    journeyDialogCompRef.componentInstance.config = config;

    journeyDialogCompRef.componentInstance.onDetailsClose.subscribe((res) => {
      res && journeyDialogCompRef.close();
    });
  }
}
