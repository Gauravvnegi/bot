import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';
import { LayoutOneComponent } from 'libs/shared/theme/src/lib/containers/layouts/layout-one/layout-one.component';
import { DaterangeComponent } from 'libs/shared/theme/src/lib/containers/daterange/daterange.component';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('layout') layoutComponent: LayoutOneComponent;

  constructor(private _resolver: ComponentFactoryResolver) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    //this.addComponentsToHeader();
  }

  private addComponentsToHeader() {
    const factoryComponent = this._resolver.resolveComponentFactory(
      DaterangeComponent
    );
    this.layoutComponent.dynamicHeaderContainer.createComponent(
      factoryComponent
    );
  }
}
