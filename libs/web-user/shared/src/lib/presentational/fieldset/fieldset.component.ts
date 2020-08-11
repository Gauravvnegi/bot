import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Output,
} from '@angular/core';
import { BaseComponent } from '../base.component';
import { EventEmitter } from 'events';

@Component({
  selector: 'web-user-fieldset',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss'],
})
export class FieldsetComponent extends BaseComponent {
  @ViewChild('fstContainer', { read: ViewContainerRef, static: true })
  fstContainer: ViewContainerRef;
  // constructor() {}

  // ngOnInit(): void {}

  ngAfterViewInit() {}
}
