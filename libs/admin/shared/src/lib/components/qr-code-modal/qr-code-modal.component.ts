import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '@hospitality-bot/shared/material';
import jsPDF from 'jspdf';

@Component({
  selector: 'hospitality-bot-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
})
export class QrCodeModalComponent implements OnInit {
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

  @Output() onClose = new EventEmitter();

  @Input() set content(value: QrCodeModalContent) {
    Object.assign(this, value);
  }

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    const data = this.modalService.__config;
    Object.assign(this, data);
  }

  close(): void {
    this.onClose.emit();
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
