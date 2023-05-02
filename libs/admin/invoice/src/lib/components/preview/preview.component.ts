import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  reservationId: string;
  previewUrl: string;
  isLoaded = false;

  constructor(private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getReservationId();
    this.invoiceService.downloadPDF(this.reservationId).subscribe(res=>{
      this.previewUrl = res.file_download_url;
      this.isLoaded=res;
    })
  }

  getReservationId(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.reservationId = id;
  }
}
