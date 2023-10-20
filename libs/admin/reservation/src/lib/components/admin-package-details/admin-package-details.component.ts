import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit,
  ComponentRef,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DefaultPackageComponent } from '../packages/default-package/default-package.component';
import { AirportPickupComponent } from '../packages/airport-pickup/airport-pickup.component';

const componentPackageMapping = {
  'AIRPORT P/UP': AirportPickupComponent,
  'AIRPORT DROP': AirportPickupComponent,
};

@Component({
  selector: 'hospitality-bot-admin-package-details',
  templateUrl: './admin-package-details.component.html',
  styleUrls: ['./admin-package-details.component.scss'],
})
export class AdminPackageDetailsComponent implements OnChanges, AfterViewInit {
  @Input('data') detailsData;
  @Input() parentForm;

  @ViewChild('paidPackage', { read: ViewContainerRef }) paidPackageRef;

  constructor(
    private _fb: FormBuilder,
    private _resolver: ComponentFactoryResolver
  ) {}

  ngOnChanges(): void {
    this.initPaidPackageForm();
  }

  ngAfterViewInit() {
    this.generatePackages();
  }

  initPaidPackageForm() {
    this.packageDetailsFG.addControl('paidAmenities', this._fb.array([]));
    this.detailsData.amenitiesDetails.paidPackages.forEach(
      (paidPackage, index) => {
        this.paidAmenityFA.push(this.getPaidAmenitiesFG());
        this.paidAmenityFA.at(index).patchValue(paidPackage);
      }
    );
  }

  generatePackages() {
    this.paidAmenityFA.controls.forEach((paidAmenity: FormGroup, index) => {
      const paidPackage = this.detailsData.amenitiesDetails.paidPackages.find(
        (paidPackage) => paidPackage.id === paidAmenity.get('id').value
      );
      if (componentPackageMapping[paidPackage.type]) {
        this.createComponent(
          componentPackageMapping[paidPackage.type],
          paidPackage,
          index
        );
      } else {
        this.createComponent(DefaultPackageComponent, paidPackage, index);
      }
    });
  }

  createComponent(component, config, index) {
    const factory = this._resolver.resolveComponentFactory(component);
    const componentRef = this.paidPackageRef.createComponent(factory);
    this.addPropsToComponentInstance(componentRef, config, index);
  }

  addPropsToComponentInstance(componentRef: ComponentRef<any>, config, index) {
    componentRef.instance.parentForm = this.parentForm;
    componentRef.instance.paidAmenityFG = this.paidAmenityFA.at(index);

    componentRef.instance.config = config;
    componentRef.instance.index = index;
  }

  isVisible() {
    return (
      this.paidAmenityFA?.controls?.length ||
      this.stayDetailsFG?.get('special_comments')?.value ||
      this.stayDetailsFG.get('checkin_comments').value
    );
  }

  getPaidAmenitiesFG() {
    return this._fb.group({
      id: [''],
      status: [''],
      remarks: ['', [Validators.maxLength(200)]],
      type: [''],
      name: [''],
      description: [''],
      unit: [''],
      currency: [''],
      rate: [''],
      imgUrl: [''],
    });
  }

  get stayDetailsFG() {
    return this.parentForm.get('stayDetails') as FormGroup;
  }

  get packageDetailsFG() {
    return this.parentForm.get('packageDetails') as FormGroup;
  }

  get paidAmenityFA() {
    return this.packageDetailsFG.get('paidAmenities') as FormArray;
  }
}
