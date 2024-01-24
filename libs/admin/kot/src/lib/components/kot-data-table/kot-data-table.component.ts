import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseDatatableComponent } from '@hospitality-bot/admin/shared';
import { KotService } from '../../services/kot.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-kot-data-table',
  templateUrl: './kot-data-table.component.html',
  styleUrls: ['./kot-data-table.component.scss'],
})
export class KotDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  entityId: string;
  $subscription = new Subscription();

  constructor(public fb: FormBuilder, private kotService: KotService) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.kotService.entityId;
  }

  loadData(event: LazyLoadEvent): void {}

  initKotData() {
    this.loading = true;
    this.$subscription.add(
      this.kotService.getKotItems(this.entityId).subscribe((res) => {
        
      })
    );
  }
}
