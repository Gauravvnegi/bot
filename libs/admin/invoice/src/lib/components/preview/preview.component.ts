import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { invoiceRoutes } from '../../constants/routes';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  reservationId: string;
  previewUrl: string;
  isLoading = true;
  navRoutes = [];
  isInvoiceGenerated = false;
  items = [
    {
      label: 'Generate Proforma',
      command: () => {
        this.handleDownload();
      },
    },
  ];
  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getReservationId();
    this.invoiceService.downloadPDF(this.reservationId).subscribe((res) => {
      this.previewUrl = res.file_download_url;
      this.isLoading = false;
    });
    this.updateNavRoutes();
  }

  getReservationId(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.reservationId = id;
  }

  updateNavRoutes(): void {
    const invoiceRoute = `/pages/efrontdesk/invoice/${this.reservationId}`;
  
    this.navRoutes = [
      { label: 'eFrontdesk', link: '/pages/efrontdesk' },
      { label: 'Invoice', link: invoiceRoute },
      { label: 'Preview Invoice', link: './'},
    ];
  }

  handleGenerateInvoice() {
    this.invoiceService.generateInvoice(this.reservationId).subscribe((res) => {
      this.snackbarService.openSnackBarAsText(
        'Invoice Generated Successfully',
        '',
        {
          panelClass: 'success',
        }
      );
      this.isInvoiceGenerated = true;
    });
  }

  handleDownload() {
    this.invoiceService.downloadPDF(this.reservationId).subscribe((res) => {
      const fileUrl = res.file_download_url;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.setRequestHeader('Content-type', 'application/pdf');
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'invoice.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };
      xhr.send();
    });
  }

  handleEmailInvoice() {
    this.invoiceService.emailInvoice(this.reservationId, {}).subscribe((_) => {
      this.snackbarService.openSnackBarAsText('Email Sent Successfully', '', {
        panelClass: 'success',
      });
    });
  }
}
