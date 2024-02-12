import { Component, Input, OnInit } from '@angular/core';
import { KotService } from '../../services/kot.service';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { PendingItemSummaryList } from '../../models/kot-pending-item.model';

@Component({
  selector: 'hospitality-bot-pending-item-summary',
  templateUrl: './pending-item-summary.component.html',
  styleUrls: ['./pending-item-summary.component.scss'],
})
export class PendingItemSummaryComponent implements OnInit {
  @Input() itemPendingSummaryList: ItemPendingSummaryList[];
  subscription = new Subscription();
  entityId: string;

  constructor(
    private kotService: KotService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initSummaryList();

    this.subscription.add(
      this.kotService.refreshData.subscribe((res) => {
        if (res) {
          this.initSummaryList();
        }
      })
    );
  }

  initSummaryList() {
    this.subscription.add(
      this.kotService.getPendingItemSummary(this.entityId).subscribe((res) => {
        this.itemPendingSummaryList = new PendingItemSummaryList().deserialize(
          res
        ).records;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

type ItemPendingSummaryList = {
  name: string;
  mealPreference: string;
  quantity: number;
};
