import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit,
  ComponentRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
export class AdminPackageDetailsComponent implements OnInit, AfterViewInit {
  @Input('data') detailsData;
  @Input() parentForm;

  @ViewChild('paidPackage', { read: ViewContainerRef }) paidPackageRef;

  constructor(
    private _fb: FormBuilder,
    private _resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
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
        this.paidAmenityFA
          .at(index)
          .patchValue(this.detailsData.amenitiesDetails.paidPackages[index]);
      }
    );
  }

  generatePackages() {
    this.paidAmenityFA.controls.forEach((paidAmenity: FormGroup, index) => {
      const paidPackage = this.detailsData.amenitiesDetails.paidPackages.find(
        (paidPackage) => paidPackage.id == paidAmenity.get('id').value
      );
      if (componentPackageMapping[paidPackage.type]) {
        //create a specifi package
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

  getPaidAmenitiesFG() {
    return this._fb.group({
      id: [''],
      status: [''],
      remarks: [''],
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
