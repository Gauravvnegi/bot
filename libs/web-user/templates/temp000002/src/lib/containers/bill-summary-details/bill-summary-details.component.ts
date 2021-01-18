import { Component, OnInit } from '@angular/core';
import { BillSummaryDetailsComponent as BaseBillSummaryDetailsComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/bill-summary-details/bill-summary-details.component';
@Component({
  selector: 'hospitality-bot-bill-summary-details',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/bill-summary-details/bill-summary-details.component.html',
  styleUrls: ['./bill-summary-details.component.scss'],
})
export class BillSummaryDetailsComponent extends BaseBillSummaryDetailsComponent {}
