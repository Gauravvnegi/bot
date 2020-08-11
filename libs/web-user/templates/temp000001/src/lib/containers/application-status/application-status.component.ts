import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  QueryList,
  ViewChildren,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  Renderer2,
  AfterViewInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { ReservationSummaryService } from 'libs/web-user/shared/src/lib/services/reservation-summary.service';
import { FormArray, FormGroup } from '@angular/forms';
import { LabelComponent } from 'libs/web-user/shared/src/lib/presentational/label/label.component';
import { FieldsetComponent } from 'libs/web-user/shared/src/lib/presentational/fieldset/fieldset.component';
import { DetailComponent } from 'libs/web-user/shared/src/lib/presentational/detail/detail.component';
import { skipWhile, debounceTime, debounce } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';

const components = {
  label: LabelComponent,
  fieldset: FieldsetComponent,
  detail: DetailComponent,
};

@Component({
  selector: 'hospitality-bot-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit, AfterViewInit {
  private _formValues: any;

  @Input()
  settings = [];

  @Input()
  context: any;

  panelOpenState: boolean[] = [];

  @ViewChildren('parentPanelContent', { read: ViewContainerRef })
  parentPanelContentContainer: QueryList<any>;

  @ViewChild('healthDiv', { static: false }) healthDiv: ElementRef;

  @Input()
  parentForm: FormArray;

  @Input()
  config: any;
  @Input() showAppStatusForm: boolean = false;

  currentParentContainer: ViewContainerRef;

  containerStack = [];
  isRendered: boolean = false;

  @Output()
  isRenderedEvent = new EventEmitter<boolean>();

  prevFormValues = '';

  $subscription = new Subscription();
  isLoaderVisible = true;

  constructor(
    private _parentFormService: ParentFormService,
    private _resolver: ComponentFactoryResolver,
    private _reservationSummaryService: ReservationSummaryService,
    private _renderer: Renderer2,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForParentFormValues();
  }

  listenForParentFormValues() {
    this.$subscription.add(
      this._parentFormService.parentFormValueAndValidity$
        .pipe(
          debounce(() => {
            this.isLoaderVisible = true;
            return timer(2000);
          }),
          skipWhile((data) => {
            let controlMap = {};
            let counter = 0;
            data['parentForm'].controls.forEach((fg: FormGroup) => {
              if (
                Object.keys(fg.controls).length &&
                !controlMap[Object.keys(fg.controls)[0]]
              ) {
                controlMap[Object.keys(fg.controls)[0]] = true;
                ++counter;
              }
            });

            return counter == data['parentForm'].controls.length ? false : true;
          })
        )
        .subscribe((data) => {
          this.parentForm = data['parentForm'];
          this._formValues = this.parentForm.getRawValue();
          this.isLoaderVisible = false;
          this.parentPanelContentContainer.changes.subscribe((value) => {
            if (this.parentPanelContentContainer.length > 0) {
              if (this.parentPanelContentContainer.length) {
                this.parentPanelContentContainer.forEach(
                  (item: ViewContainerRef) => {
                    item.clear();
                  }
                );
              }
              this.makeComponentsDynamic();
            }
          });
        })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // this.makeComponentsDynamic();
  }

  makeComponentsDynamic() {
    for (let panelIndex in this.config) {
      if (this.config[panelIndex].child.length) {
        if (this.config[panelIndex].type == 'primary') {
          this.currentParentContainer = this.parentPanelContentContainer.toArray()[
            panelIndex
          ];

          this.generateChildComponents(
            this.config[panelIndex].child,
            this.parentPanelContentContainer.toArray()[panelIndex]
          );
        } else if (this.config[panelIndex].type == 'secondary') {
        }
      }
    }
  }

  async generateChildComponents(childComponents, container) {
    for (let childComponentndex in childComponents) {
      if (!container) {
        container = this.currentParentContainer;
      }

      this.containerStack.push(container);
      container = this.containerStack[this.containerStack.length - 1];

      const componentRef = this.generateComponent(
        childComponents[childComponentndex],
        container
      );

      if (componentRef && componentRef.instance.settings.type == 'fieldset') {
        container = componentRef.instance.fstContainer;
      }

      if (
        childComponents[childComponentndex].child &&
        childComponents[childComponentndex].child.length
      ) {
        this.generateChildComponents(
          [...childComponents[childComponentndex].child],
          container
        );
      }
      if (componentRef && componentRef.instance.settings.type == 'fieldset') {
        container = this.containerStack.pop();
      }

      this.containerStack.pop();
    }
  }

  generateComponent(config, container: ViewContainerRef) {
    if (config && components[config.component.type]) {
      const factoryComponent = this._resolver.resolveComponentFactory(
        components[config.component.type]
      );
      const componentObj = container.createComponent(factoryComponent) as any;

      if (componentObj) {
        let key = `FLD_${Math.random().toString(36).substring(7)}`;
        componentObj.instance.settings = {
          label: config.component.label,
          master_label: `${config.indexName}${config.indexStyle} ${config.component.master_label}`,
          options: config.component.options,
          icon: config.component.icon,
          appearance: config.component.appearance,
          type: config.component.type,
          style: config.component.style,
          mediaQuery: config.component.mediaQuery,
          validation: config.component.validation,
          value: this.getValue(config.component) || config.component.value,
          status: {
            ...config.component.status,
            code: this.getControlValidityStatus(
              config.component,
              config.component.controlName
            ),
          },
          valueType: config.component.valueType || '',
        };

        componentObj.instance.name = key;

        if (config.component.handler) {
          this.attachListenersToComponent(config.component, componentObj);
        }

        if (config.component.transforms && config.component.transforms.length) {
          config.component.transforms.forEach(async (fn: Function) => {
            componentObj.instance.settings = await fn.call(
              componentObj.instance.settings
            );
          });
        }
      }
      return componentObj;
    }
  }

  closeModal() {
    this._matDialog.closeAll();
  }

  private getValue(component: any) {
    return this._reservationSummaryService.getValue(component, this.parentForm);
  }

  private getControlValidityStatus(component: any, controlName: string) {
    if (component.status && component.status.code) return component.status.code;

    return this._reservationSummaryService.getControlValidityStatus(
      component.controlName,
      this.parentForm
    );
  }

  private attachListenersToComponent(component: any, factoryComponent: any) {
    component.handler.type.forEach((handlerType: any) => {
      this._renderer.listen(
        factoryComponent.location.nativeElement,
        handlerType,
        (event) =>
          this.context[component.handler.fn_name](
            event,
            component.handler.arguments
          )
      );
    });
  }
}
