import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  reservationId: string;
  previewUrl: string;
  loadingPdf = true;
  isLoading = true;
  navRoutes = [];
  isInvoiceGenerated = false;
  failedToLoad = false;
  // items = [
  //   {
  //     label: 'Generate Proforma',
  //     command: () => {
  //       this.handleDownload();
  //     },
  //   },
  // ];
  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.reservationId = id;
    this.updateNavRoutes();
    this.getPreviewUrl();
    this.getInvoiceData();
  }

  getInvoiceData() {
    this.isLoading = true;
    this.invoiceService.getInvoiceData(this.reservationId).subscribe(
      (res) => (this.isInvoiceGenerated = res.invoiceGenerated),
      () => {},
      () => (this.isLoading = false)
    );
  }

  getPreviewUrl() {
    this.loadingPdf = true;
    this.invoiceService.downloadPDF(this.reservationId).subscribe(
      (res) => {
        this.previewUrl = res.file_download_url;
        this.loadingPdf = false;
      },
      (error) => {
        this.loadingPdf = false;
        this.failedToLoad = true;
      }
    );
  }

  updateNavRoutes(): void {
    const invoiceRoute = `/pages/efrontdesk/invoice/${this.reservationId}`;

    this.navRoutes = [
      { label: 'eFrontdesk', link: '/pages/efrontdesk' },
      { label: 'Invoice', link: invoiceRoute },
      { label: 'Preview Invoice', link: './' },
    ];
  }

  handleGenerateInvoice() {
    this.invoiceService.generateInvoice(this.reservationId).subscribe(
      (res) => {
        this.snackbarService.openSnackBarAsText(
          'Invoice Generated Successfully',
          '',
          {
            panelClass: 'success',
          }
        );
        this.isInvoiceGenerated = true;
        this.getPreviewUrl();
      },
      () => {}
    );
  }

  handleDownload() {
    this.invoiceService.handleInvoiceDownload(this.reservationId);
  }

  handleEmailInvoice() {
    this.invoiceService.emailInvoice(this.reservationId, {}).subscribe((_) => {
      this.snackbarService.openSnackBarAsText('Email Sent Successfully', '', {
        panelClass: 'success',
      });
    });
  }
}
