import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { outletRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';

@Component({
  selector: 'hospitality-bot-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent implements OnInit {
  useForm: FormGroup;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

  mealPreferences: Option[] = [];

  types: Option[] = [];

  categories: Option[] = [];

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
    return 'Are you sure you want to leave? Your unsaved changes will be lost.';
  }

  constructor(private fb: FormBuilder, private outletService: OutletService) {
    const { navRoutes, title } = outletRoutes['addMenuItem'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.initOptions();
    this.initForm();
  }

  initOptions() {
    const menu = this.outletService.menu.value;
    console.log(menu);
    this.mealPreferences = menu.mealPreference.map((item) => ({
      label: item,
      value: item,
    }));
    this.types = menu.type.map((item) => ({
      label: item,
      value: item,
    }));
    this.categories = menu.category.map((item) => ({
      label: item,
      value: item,
    }));
  }

  initForm(): void {
    this.useForm = this.fb.group({
      active: [true],
      name: ['', Validators.required],
      mealPreference: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      preparationTime: ['', Validators.required],
      unit: ['', Validators.required],
      dineInPrice: ['', Validators.required],
      hsnCode: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  handleReset() {}

  handleSubmit() {}
}
