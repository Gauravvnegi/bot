import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalContent } from '../../types/fields.type';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
import jspdf from 'jspdf';

@Component({
  selector: 'hospitality-bot-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
})
export class QrCodeModalComponent implements OnInit {
  heading = 'Print QR Code';

  //for background image
  backgroundURl = 'assets/images/auth-banner.webp';

  //for logo
  logoUrl = 'assets/images/leela-logo.png';

  //for BOTSHOT logo
  botshotUrl = 'assets/images/botshotlogo-color.png';

  //for route to redirect after scan
  route = 'https://Leela.botshot.ai';

  //for description heading
  descriptionsHeading = 'HOW TO ORDER';

  //for description points
  descriptionsPoints: string[] = [
    'Scan the QR code to access the menu',
    'Browse the menu and place your order',
    'Place your orders',
  ];

  //event close modal
  @Output() onClose = new EventEmitter();

  @Input() set content(value: QrCodeModalContent) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  constructor() {}

  ngOnInit(): void {}

  close(): void {
    this.onClose.emit();
  }

  generatePdf() {
    const doc = new jsPDF();

    // Get the element containing the page content
    const content = document.getElementById('qr-code-modal');

    html2canvas(content).then((canvas) => {
      // Convert the canvas to an image data URL
      const imgData = canvas.toDataURL('image/png');

      // Set the image as the background of the first PDF page
      doc.addImage(
        imgData,
        'PNG',
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      );

      // Save the PDF
      doc.save('your-page.pdf');
    });
  }
}

export type QrCodeModalContent = {
  heading: string;
  backgroundURl?: string;
  logoUrl?: string;
  route?: string;
  descriptionsHeading?: string;
  descriptionsPoints?: string[];
};
