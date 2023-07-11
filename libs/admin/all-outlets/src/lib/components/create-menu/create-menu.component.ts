import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService, NavRouteOptions } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { OutletBaseComponent } from '../outlet-base.components';
import { MenuFormData, MenuResponse } from '../../types/menu';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';

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

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
    return 'Are you sure you want to leave? Your unsaved changes will be lost.';
  }

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private configService: ConfigService,
    public router: Router,
    public route: ActivatedRoute,
    private outletService: OutletService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.initForm();
    // this.initOptionsConfig();
    this.initComponent('menu');
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
      this.outletService.getMenu(this.menuId).subscribe((res) => {
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
          .updateMenu(data, this.menuId)
          .subscribe(this.handleSuccess, this.handleError)
      );
    } else {
      this.loading = true;
      this.$subscription.add(
        this.outletService.addMenu(data).subscribe((res: MenuResponse) => {
          this.handleSuccess(res?.id);
        }, this.handleError)
      );
    }
  }

  handleSuccess = (id?: string) => {
    this.loading = false;
    const event = new BeforeUnloadEvent();
    debugger;
    event.returnValue = true;
    this.snackbarService.openSnackBarAsText(
      `Service ${this.menuId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    if (event.returnValue && id) {
      this.router.navigate([id], {
        relativeTo: this.route,
      });
    }
  };

  handleReset() {
    this.useForm.reset();
  }

  handleDownload() {}

  handlePrintMenu() {}

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
  }
}
