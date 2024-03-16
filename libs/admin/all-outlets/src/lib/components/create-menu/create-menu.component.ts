import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { OutletBaseComponent } from '../outlet-base.components';
import { MenuFormData, MenuResponse } from '../../types/menu';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';
import { PageReloadService } from '../../services/page-reload.service.service';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss'],
})
export class CreateMenuComponent extends OutletBaseComponent implements OnInit {
  outletId: string;
  brandId: string;
  menuId: string;
  useForm: FormGroup;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';
  loading = false;
  $subscription = new Subscription();

  buttons = [
    {
      label: 'Print Menu',
      command: () => {
        this.handlePrintMenu();
      },
    },
  ];
  isScrollToBottom: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    public router: Router,
    public route: ActivatedRoute,
    private outletService: OutletService,
    private pageReloadService: PageReloadService,
    protected routesConfigService: RoutesConfigService
  ) {
    super(router, route, routesConfigService);
    this.isScrollToBottom = this.router?.getCurrentNavigation()?.extras?.state?.isScrollToBottom;
  }

  ngOnInit(): void {
    this.pageReloadService.enablePageReloadConfirmation();
    if (this.isScrollToBottom) this.scrollToBottom();

    this.initForm();
    // this.initOptionsConfig();
    this.initRoutes('menu');
  }

  initForm(): void {
    this.useForm = this.fb.group({
      status: [true],
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: [''],
    });

    if (this.menuId) {
      this.initFormData();
    }
  }

  initFormData() {
    this.$subscription.add(
      this.outletService
        .getMenu(this.menuId, this.outletId)
        .subscribe((res) => {
          this.useForm.patchValue(res);
        }, this.handleError)
    );
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    const data = this.useForm.getRawValue() as MenuFormData;
    if (this.menuId) {
      this.loading = true;
      this.$subscription.add(
        this.outletService
          .updateMenu(data, this.menuId, this.outletId)
          .subscribe(this.handleSuccess, this.handleError)
      );
    } else {
      this.loading = true;
      this.$subscription.add(
        this.outletService
          .addMenu(data, this.outletId)
          .subscribe((res: MenuResponse) => {
            if (res?.id) {
              this.router.navigate([res?.id], {
                relativeTo: this.route,
                replaceUrl: true,
                state: { isScrollToBottom: true },
              });
            }
          }, this.handleError)
      );
    }
  }

  handleSuccess = (id?: string) => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Menu ${this.menuId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.routesConfigService.goBack();
  };

  handleReset() {
    this.useForm.reset();
  }

  handleDownload() {}

  handlePrintMenu() {}

  scrollToBottom() {
    const mainLayout = document.getElementById('main-layout');
    mainLayout.scrollTo({
      top: mainLayout.scrollHeight,
      behavior: 'smooth', // Optional, for smooth scrolling
    });
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.pageReloadService.disablePageReloadConfirmation();
  }
}
