import { Component, OnInit } from '@angular/core';
import { InvoiceNotGeneratedComponent as BaseInvoiceNotGeneratedComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/invoice-not-generated/invoice-not-generated.component';

@Component({
  selector: 'hospitality-bot-invoice-not-generated',
  templateUrl: './invoice-not-generated.component.html',
  styleUrls: ['./invoice-not-generated.component.scss'],
})
export class InvoiceNotGeneratedComponent extends BaseInvoiceNotGeneratedComponent {}
