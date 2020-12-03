import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';

@Component({
  selector: 'hospitality-bot-paid-amenities',
  templateUrl: './paid-amenities.component.html',
  styleUrls: ['./paid-amenities.component.scss']
})
export class PaidAmenitiesComponent implements OnInit {

  @Input() parentForm: FormGroup;

  packageControl;
  selectedSlide;

  paidAmenitiesForm: FormGroup;
  slides = [];
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
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
    private _fb: FormBuilder,
    private _paidService: PaidService,
  ) {
    this.initPaidAmenitiesForm();
   }

  ngOnInit(): void {
    this.slides = this.paidAmenities;
    this.addAmenityToForm();
  }

  ngOnChanges() {
    this.amenitiesForm.addControl('paidAmenities', this.paidAmenitiesForm);
  }

  initPaidAmenitiesForm() {
    this.paidAmenitiesForm = this._fb.group({});
  }

  addAmenityToForm() {
    this.slides.forEach((slide) => {
      this.paidAmenitiesForm.addControl(
        slide.packageCode,
        this.getAmenitiesFG()
      );
      if(slide.subPackages.length>0){
        this.addSubPackageToAmenity(slide);
      }
      this.getAminityForm(slide.packageCode).patchValue(slide);
      // console.log('paidamenityForm',this.paidAmenitiesForm);
    });
  }

  addSubPackageToAmenity(slide){
    slide.subPackages.forEach(subPackage => {
      let subPackageFA = 
      this.paidAmenitiesForm.get(slide.packageCode).get('subPackages')as FormArray;
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
      active:[''],
      hasChild:[''],
      description:[''],
      autoAccept:[''],
      unit:[''],
      type:[''],
      source:[''],
      category:[''],
      subPackages:new FormArray([])
    });
  }

  openPackage(packageCode){
    this.packageControl = this.getAminityForm(packageCode);
    this.selectedSlide = Object.assign({},this.slides.find(slideData =>slideData.packageCode === packageCode));
  }

  onPackageUpdate(event){
    this.packageControl = null;
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
        const slidePackageCode = (element.firstChild as HTMLElement).getAttribute(
          'data-slidedata'
        );

        if (slidePackageCode) {
          element.addEventListener(
            'click',
            this.openPackage.bind(this, slidePackageCode)
          );
        }
      }
    }
  }

  trackByPackageId(index: number, paidPackage: any) {
    return paidPackage['id'];
  }

  getAminityForm(packageCode) {
    return this.paidAmenitiesForm.get(packageCode) as FormGroup;
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
