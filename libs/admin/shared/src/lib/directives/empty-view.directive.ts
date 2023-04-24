import {
  ComponentFactoryResolver,
  Directive,
  Input,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { EmptyTableComponent } from '../components/datatable/empty-table/empty-table.component';

@Directive({
  selector: '[emptyView]',
})
export class EmptyViewDirective {
  @Input('emptyView') isEmpty = false;
  actionName: string;
  description: string;
  link: string;
  imageSrc: string;

  @Input('emptyViewContent') set content(data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewCF: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isEmpty) {
      this.viewCF.clear();
      if (changes.isEmpty.currentValue) {
        const componentFactory = this.resolver.resolveComponentFactory(
          EmptyTableComponent
        );
        const ref = this.viewCF.createComponent(componentFactory);

        Object.assign(ref.instance, {
          description: this.description,
          link: this.link,
          actionName: this.actionName,
          imageSrc: this.imageSrc,
        });
      } else {
        this.viewCF.createEmbeddedView(this.templateRef);
      }
    }
  }
}
