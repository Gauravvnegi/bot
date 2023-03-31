import {
  ComponentFactoryResolver,
  Directive,
  Input,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { random } from 'lodash';
import { SkeletonShapeComponent } from '../components/skeleton/skeleton-shape/skeleton-shape.component';

@Directive({
  selector: '[skeleton]',
})
export class SkeletonDirective {
  @Input('skeleton') isLoading = false;
  @Input('skeletonRepeat') size = 1;
  @Input('skeletonWidth') width: string;
  @Input('skeletonHeight') height: string;
  @Input('skeletonClassName') className: string;
  @Input('skeletonBorderRadius') borderRadius: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewCF: ViewContainerRef,
    private _componentResolver: ComponentFactoryResolver
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isLoading) {
      this.viewCF.clear();
      if (changes.isLoading.currentValue) {
        Array.from({ length: this.size }).forEach(() => {
          const componentFactory = this._componentResolver.resolveComponentFactory(
            SkeletonShapeComponent
          );
          const ref = this.viewCF.createComponent(componentFactory);

          Object.assign(ref.instance, {
            width: this.width === 'rand' ? `${random(30, 90)}%` : this.width,
            height: this.height,
            borderRadius: this.borderRadius,
            className: this.className,
          });
        });
      } else {
        this.viewCF.createEmbeddedView(this.templateRef);
      }
    }
  }
}
