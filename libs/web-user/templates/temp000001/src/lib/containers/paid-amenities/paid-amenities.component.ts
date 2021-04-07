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
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;

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

  constructor(
    protected _fb: FormBuilder,
    protected _paidService: PaidService,
    protected _resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.addAmenityToForm();
  }

  initPaidAmenitiesForm() {
    this.parentForm = this._fb.group({});
  }

  addAmenityToForm() {
    this.paidAmenities.forEach((slide) => {
      this.parentForm.addControl(slide.packageCode, this.getAmenitiesFG());
      if (slide.subPackages.length > 0) {
        this.addSubPackageToAmenity(slide);
      }
      this.getAminityForm(slide.packageCode).patchValue(slide);
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
    this.selectedService=packageCode;
    this.pauseSlickCarousel();
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
        () => {
          this.packageRendererComponentRefObj.destroy();
          this.playSlickCarousel();
        }
      )
    );
  }

  clearPackageRendererContainer() {
    if (this.packageRendererContainer) {
      this.packageRendererContainer.clear();
    }
  }

  afterChange(e) {
    let draggableList = (e.event.target as HTMLElement).getElementsByClassName(
      'slick-list draggable'
    );
    if (draggableList && draggableList.length) {
      let draggableEL = draggableList[0];
      const elements = Array.from(
        (draggableEL.firstChild as HTMLElement).getElementsByClassName(
          'slick-cloned'
        )
      );

      for (const element of elements) {
        element.addEventListener('click', this.selectedSlide.bind(this));
        // const slidePackageCode = (element.firstChild as HTMLElement).getAttribute(
        //   'data-slidedata'
        // );

        // if (slidePackageCode) {
        //   element.addEventListener(
        //     'click',
        //     this.openPackage.bind(this, slidePackageCode)
        //   );
        // }
      }
    }
  }

  trackByPackageId(index: number, paidPackage: any) {
    return paidPackage['id'];
  }

  pauseSlickCarousel() {
    this.slickModal.slickPause();
  }

  playSlickCarousel() {
    this.slickModal.slickPlay();
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
}
