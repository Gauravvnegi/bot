import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
})
export class QrCodeModalComponent {
  heading = 'Print QR Code';
  backgroundURl = 'assets/images/auth-banner.webp';
  logoUrl = 'assets/images/leela-logo.png';
  botshotUrl = 'assets/images/botshotlogo-color.png';
  route = 'https://www.test.menu.com/';
  descriptionsHeading = 'HOW TO ORDER';
  descriptionsPoints = [
    'Scan the QR code to access the menu',
    'Browse the menu and place your order',
    'Place your orders',
  ];

  @Input() set content(value: QrCodeModalContent) {
    Object.assign(this, value);
  }

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {
    /**
     * @remarks Extracting data from dialog Service
     */
    const data = this.dialogConfig?.data as QrCodeModalComponent;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  generatePdf() {
    const pdf = new jsPDF();
    const container = document.getElementById('qr-code-modal');

    pdf.html(container, {
      callback: (pdf) => {
        pdf.save('qr-code.pdf');
      },
    });
  }
}

export type QrCodeModalContent = {
  heading?: string;
  backgroundURl?: string;
  logoUrl?: string;
  route?: string;
  descriptionsHeading?: string;
  descriptionsPoints?: string[];
};
