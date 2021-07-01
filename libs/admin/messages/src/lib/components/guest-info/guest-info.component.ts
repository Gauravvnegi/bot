import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { GuestDetailMapComponent } from '../guest-detail-map/guest-detail-map.component';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit {
  @Input() refreshData;
  @Input() data;
  @Output() closeInfo = new EventEmitter();
  @Output() updateReceiver = new EventEmitter();
  @ViewChild('matTab') matTab: MatTabGroup;
  selectedIndex = 0;
  buttonConfig = [
    {
      button: true,
      label: 'Edit Details',
      icon: 'assets/svg/user.svg',
    },
    {
      button: true,
      label: 'Map Details',
      icon: 'assets/svg/user.svg',
    },
    { button: false, label: 'Edit Details', icon: 'assets/svg/user.svg' },
    { button: false, label: 'Map Details', icon: 'assets/svg/user.svg' },
  ];
  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }

  onTabChanged(event) {
    this.selectedIndex = event.index;
  }

  handleButtonCLick(): void {
    switch (this.selectedIndex) {
      case 0:
        this.updateGuestDetails();
        break;
      case 1:
        this.updateGuestDetails();
        break;
    }
  }

  updateGuestDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      GuestDetailMapComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.data = this.data;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      if (res?.data) {
        this.updateReceiver.emit(res.data);
      }
      // remove loader for detail close
      detailCompRef.close();
    });
  }
}
