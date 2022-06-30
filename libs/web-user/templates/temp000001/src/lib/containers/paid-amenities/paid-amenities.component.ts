import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { Subscription } from 'rxjs';
import { PackageRendererComponent } from '../package-renderer/package-renderer.component';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

@Component({
  selector: 'hospitality-bot-paid-amenities',
  templateUrl: './paid-amenities.component.html',
  styleUrls: ['./paid-amenities.component.scss'],
})
export class PaidAmenitiesComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;

  @ViewChild('packageRenderer', { read: ViewContainerRef })
  packageRendererContainer;

  protected $subscription: Subscription = new Subscription();

  protected packageRenderComponent = PackageRendererComponent;

  selectedSlide;
  packageRendererComponentRefObj;
  selectedService;

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: false,
    speed: 100,
    autoplay: true,
    method: {},
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  tabFilterItems = [];
  dropdownItems = [];
  tabFilterIdx = 0;

  constructor(
    protected _fb: FormBuilder,
    protected _paidService: PaidService,
    protected _resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.addAmenityToForm();
  }

  ngAfterViewInit(): void {
    this.openPackage(this.tabFilterItems[this.tabFilterIdx].value);
  }

  initPaidAmenitiesForm() {
    this.parentForm = this._fb.group({});
  }

  addAmenityToForm() {
    this.tabFilterItems = [];
    this.paidAmenities.forEach((slide, i) => {
      this.tabFilterItems.push({
        value: slide.packageCode,
        label: slide.label,
        total: 0,
        index: i,
      });
      this.parentForm.addControl(slide.packageCode, this.getAmenitiesFG());
      if (slide.subPackages?.length > 0) {
        this.addSubPackageToAmenity(slide);
      }
      this.getAminityForm(slide.packageCode).patchValue(slide);
      if (this.packageRendererContainer && i === 0)
        this.openPackage(slide.packageCode);
    });
  }

  addSubPackageToAmenity(slide) {
    slide.subPackages.forEach((subPackage) => {
      let subPackageFA = this.parentForm
        .get(slide.packageCode)
        .get('subPackages') as FormArray;
      subPackageFA.push(this.getAmenitiesFG());
    });
  }

  getAmenitiesFG() {
    return this._fb.group({
      id: [''],
      rate: [''],
      currencyCode: [''],
      packageCode: [''],
      imgUrl: [''],
      label: [''],
      isSelected: [''],
      active: [''],
      hasChild: [''],
      description: [''],
      autoAccept: [''],
      unit: [''],
      type: [''],
      source: [''],
      category: [''],
      subPackages: new FormArray([]),
    });
  }

  openPackage(packageCode) {
    this.selectedService = packageCode;
    this.clearPackageRendererContainer();
    let serviceFormGroup = this.getAminityForm(packageCode);
    this.selectedSlide = this.paidAmenities.find(
      (slideData) => slideData.packageCode === packageCode
    );
    this.createComponent(
      this.packageRenderComponent,
      serviceFormGroup,
      this.selectedSlide
    );
  }

  createComponent(component, serviceFormGroup, selectedSlide) {
    const factory = this._resolver.resolveComponentFactory(component);
    this.packageRendererComponentRefObj = this.packageRendererContainer.createComponent(
      factory
    );
    this.addPropsToComponentInstance(serviceFormGroup, selectedSlide);
  }

  addPropsToComponentInstance(serviceFormGroup, selectedSlide) {
    this.packageRendererComponentRefObj.instance.parentForm = serviceFormGroup;
    this.packageRendererComponentRefObj.instance.slideData = selectedSlide;
    this.listenForPackageUpdate();
  }

  listenForPackageUpdate() {
    this.$subscription.add(
      this.packageRendererComponentRefObj.instance.onPackageUpdate.subscribe(
        (response) => {
          this.packageRendererComponentRefObj.destroy();
          this.openPackage(response.data.packageCode);
        }
      )
    );
  }

  clearPackageRendererContainer() {
    if (this.packageRendererContainer) {
      this.packageRendererContainer.clear();
    }
  }

  trackByPackageId(index: number, paidPackage: any) {
    return paidPackage['id'];
  }

  getAminityForm(packageCode) {
    return this.parentForm.get(packageCode) as FormGroup;
  }

  ngOnDestroy() {
    if (this.packageRendererComponentRefObj) {
      this.packageRendererComponentRefObj.destroy();
    }
    this.$subscription.unsubscribe();
  }

  get amenitiesForm() {
    return this.parentForm.get('amenities') as FormGroup;
  }

  get paidAmenities() {
    return (
      this._paidService.paidAmenities &&
      this._paidService.paidAmenities.paidService
    );
  }

  get tabListItems() {
    return this.tabFilterItems.slice(0, 4);
  }

  handleTabSelectionChange(event) {
    this.tabFilterIdx = event.index;
    this.openPackage(this.tabFilterItems[this.tabFilterIdx].value);
  }

  handleMoreServicesSelect(event) {
    this.tabFilterIdx = event.value.index;
    this.openPackage(this.tabFilterItems[this.tabFilterIdx].value);
  }
}
