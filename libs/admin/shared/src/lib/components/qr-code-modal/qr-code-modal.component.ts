import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalContent } from '../../types/fields.type';
import jsPDF from 'jspdf';

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
  route = 'https://www.test.menu.com/';

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
    const pdf = new jsPDF();
    const container = document.getElementById('qr-code-modal');

    // Generate PDF from HTML using the html() method of jsPDF
    pdf.html(container, {
      callback: (pdf) => {
        pdf.save('qr-code.pdf');
      },
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
