import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarPriceService } from '../../services/bar-price.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnDestroy {
  constructor(private barPriceService: BarPriceService) {}

  ngOnDestroy(): void {
    this.barPriceService.resetRoomDetails();
  }
}
