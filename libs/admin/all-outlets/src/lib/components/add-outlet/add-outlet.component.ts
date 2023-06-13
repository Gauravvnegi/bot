import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { outletRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';

@Component({
  selector: 'hospitality-bot-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss'],
})
export class AddOutletComponent implements OnInit {
  pageTitle: string = '';
  navRoutes: NavRouteOptions = [];
  useForm: FormGroup;
  types: Option[] = [];
  subType: Option[] = [];
  isTypeSelected = false;

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
    return 'Are you sure you want to leave? Your unsaved changes will be lost.';
  }

  constructor(private fb: FormBuilder, private outletService: OutletService) {
    const { navRoutes, title } = outletRoutes['addOutlet'];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.initOptions();
    this.initForm();
  }

  initOptions() {
    this.outletService.getOutletConfig().subscribe((res) => {
      console.log(res);
      this.types = res.type.map((item) => ({
        label: item.name,
        value: item.value,
        subTypes: item.subtype,
        menu: item?.menu,
      }));
    });
  }

  initForm(): void {
    this.useForm = this.fb.group({
      name: [''],
      type: [[]],
      subType: [[]],
      contact: this.fb.group({
        countryCode: [''],
        number: [''],
      }),
      openingDay: [''],
      closingDay: [''],
      openingHour: [''],
      closingHour: [''],
      address: [[]],
      imageUrl: [[]],
      description: [''],
      rules: [[]],
      serviceIds: [[]],
      menu: [[]],
      socialMedia: [[]],
      maxOccupancy: [''],
      area: [''],
    });
  }

  onTypeChange(type: string) {
    const selectedType = this.types.filter((item) => item.value === type);
    this.isTypeSelected = true;
    this.subType = selectedType[0].subTypes.map((item) => ({
      label: item,
      value: item,
    }));
    if (selectedType[0].value === 'RESTAURANT') {
      this.outletService.menu.next(selectedType[0].menu);
    }
    console.log(this.outletService.menu);
  }

  resetForm(): void {
    this.useForm.reset();
  }

  submitForm(): void {}
}
