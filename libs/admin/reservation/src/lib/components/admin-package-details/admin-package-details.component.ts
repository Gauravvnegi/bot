import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DefaultPackageComponent } from '../packages/default-package/default-package.component';

const componentPackageMapping = {};

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
    this.paidAmenityFA.controls.forEach((paidAmenity: FormGroup) => {
      const paidPackage = this.detailsData.amenitiesDetails.paidPackages.find(
        (paidPackage) => paidPackage.id == paidAmenity.get('id').value
      );
      if (componentPackageMapping[paidPackage.type]) {
        //create a specifi package
      } else {
        this.createComponent(DefaultPackageComponent, paidPackage);
      }
    });
  }

  createComponent(component, config) {
    const factory = this._resolver.resolveComponentFactory(component);
    const componentRef = this.paidPackageRef.createComponent(factory);
    this.addPropsToComponentInstance(componentRef, config);
  }

  addPropsToComponentInstance(componentRef, config) {}

  getPaidAmenitiesFG() {
    return this._fb.group({
      id: [''],
      status: [''],
      type: [''],
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
