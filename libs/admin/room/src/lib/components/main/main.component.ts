import { Component, OnDestroy } from '@angular/core';
import { TableValue } from '../../constant/data-table';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  constructor(private roomService: RoomService) {}

  ngOnDestroy(): void {
    this.roomService.selectedTable = TableValue.roomType;
  }
}
