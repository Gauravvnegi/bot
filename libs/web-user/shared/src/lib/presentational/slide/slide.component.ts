import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'web-user-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss']
})
export class SlideComponent extends BaseComponent {

  @Input() amenityForm;
  @Input() slide;
  @Output()
  slideData = new EventEmitter();
  selectedService='';

  servicePackage(value){
    this.selectedService = value;
    this.slideData.emit(this.slide);
  }
}

  