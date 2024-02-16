import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { MenuItem } from 'primeng/api';
import { invoiceRoutes } from '../../constants/routes';
import { InvoiceService } from '../../services/invoice.service';
import { ReservationFormService } from 'libs/admin/reservation/src/lib/services/reservation-form.service';
import { ModuleNames, ProductNames } from '@hospitality-bot/admin/shared';

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
  pageTitle = 'Preview Invoice';
  isPrintRate = true;
  isCheckIn = false;
  isCheckedOut = false;
  entityId: string;
  loadingInvoiceGenerate: boolean = false;

  // items = [
  //   {
  //     label: 'Generate Proforma',
  //     command: () => {
  //       this.handleDownload();
  //     },
  //   },
  // ];

  invoiceButtons: MenuItem[];

  constructor(
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService,
    private routesConfigService: RoutesConfigService,
    private subscriptionService: SubscriptionPlanService,
    private formService: ReservationFormService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const { navRoutes, title } = invoiceRoutes['previewInvoice'];
    this.entityId = this.globalFilterService.entityId;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
    this.reservationId = id;
    this.listenRouteData();
    this.getInvoiceData();
    this.getPreviewUrl();
    this.initNavRoutes();
  }

  getInvoiceData() {
    this.isLoading = true;
    this.invoiceService.getInvoiceData(this.reservationId).subscribe(
      (res) => (this.isInvoiceGenerated = res.invoiceGenerated),
      () => {},
      () => (this.isLoading = false)
    );
    this.invoiceService.isPrintRate.subscribe((res) => {
      if (typeof res === 'boolean') {
        this.isPrintRate = res;
        this.invoiceButtons = this.isPrintRate
          ? [
              {
                label: 'Email Invoice',
                command: () => {
                  this.handleEmailInvoice();
                },
              },
            ]
          : [
              {
                label: 'Email Invoice',
                command: () => {
                  this.handleEmailInvoice();
                },
                disabled: true,
              },
            ];
      }
    });
  }

  getPreviewUrl() {
    this.loadingPdf = true;
    this.invoiceService
      .downloadPDF(
        this.reservationId,
        this.isInvoiceGenerated ? 'REALISED' : null
      )
      .subscribe(
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

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
    this.navRoutes[2].link = this.navRoutes[2].link + '/' + this.reservationId;
  }

  handleGenerateInvoice() {
    this.loadingInvoiceGenerate = true;
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
      (error) => (this.loadingInvoiceGenerate = false),
      () => {
        this.loadingInvoiceGenerate = false;
      }
    );
  }

  listenRouteData() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.data) {
        const data = queryParams.data;
        const paramsData = JSON.parse(atob(data));
        this.isCheckIn = paramsData.isCheckin;
        this.isCheckedOut = paramsData.isCheckout;
        this.isInvoiceGenerated = paramsData.isInvoiceGenerated;
      }
    });
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

  handleCheckout() {
    this.formService.manualCheckout(
      this.reservationId,
      () => {
        this.isCheckedOut = true;
        this.snackbarService.openSnackBarAsText('Checkout completed.', '', {
          panelClass: 'success',
        });
      },
      this.entityId
    );
    // this.reservationService
    //   .manualCheckout(this.reservationId)
    //   .subscribe((res) => {

    //   });
  }

  get isPermissionToCheckInOrOut(): boolean {
    return this.subscriptionService.show().isPermissionToEditReservation;
  }
}
