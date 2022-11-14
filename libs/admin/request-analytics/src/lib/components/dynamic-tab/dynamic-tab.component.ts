import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ContentContainerDirective } from '../../directives/content-container.directive';
import { Tab } from '../../models/tab.model';

@Component({
  selector: 'hospitality-bot-dynamic-tab',
  templateUrl: './dynamic-tab.component.html',
  styleUrls: ['./dynamic-tab.component.scss'],
})
export class DynamicTabComponent {
  @Input() tab;
  @ViewChild(ContentContainerDirective, { static: true })
  contentContainer: ContentContainerDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnViewChecked() {
    const tab: Tab = this.tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      tab.component
    );
    const viewContainerRef = this.contentContainer.viewContainerRef;
    viewContainerRef.createComponent(componentFactory);
  }
}
