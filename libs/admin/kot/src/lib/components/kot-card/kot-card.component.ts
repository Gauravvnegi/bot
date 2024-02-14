import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Instructions } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { Config } from '../../types/kot-card.type';
import { Subscription, interval } from 'rxjs';
import { KotService } from '../../services/kot.service';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-kot-card',
  templateUrl: './kot-card.component.html',
  styleUrls: ['./kot-card.component.scss'],
})
export class KotCardComponent implements OnInit {
  constructor(
    private kotServices: KotService,
    private snackbarService: SnackBarService
  ) {}
  subscription = new Subscription();
  @Input() entityId: string;
  _config: Config;

  @Input() set config(value: Config) {
    this._config = value;
    this.subscription = interval(1000).subscribe(() => {
      if (this._config.status === 'PREPARING') this._config.getTime();
    });
    debugger;
  }

  ngOnInit(): void {}

  toggleInstruction(index: number): void {
    this._config.menuItem[index].isExpandedInstruction = !this._config.menuItem[
      index
    ].isExpandedInstruction;
  }

  markFoodIsReady() {
    this.subscription.add(
      this.kotServices
        .updateOrder(this.entityId, this._config.orderId, {
          kots: [{ id: this._config.id, status: 'PREPARED' }],
        })
        .subscribe((res) => {
          this.kotServices.refreshData.next(true);
          this.snackbarService.openSnackBarAsText(
            `Kot Status updated successfully`,
            '',
            { panelClass: 'success' }
          );
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
