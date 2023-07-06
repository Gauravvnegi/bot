import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService, NavRouteOptions } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { outletBusinessRoutes } from '../../constants/routes';
import { OutletBaseComponent } from '../outlet-base.components';

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
    router: Router,
    route: ActivatedRoute
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
      active: [true],
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: [''],
    });
  }

  handleSubmit() {}

  handleReset() {}

  handleDownload() {}

  handlePrintMenu() {}
}
