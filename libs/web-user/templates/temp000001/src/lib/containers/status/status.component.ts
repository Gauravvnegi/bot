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
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'libs/web-user/shared/src/lib/presentational/modal/modal.component';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { LabelComponent } from 'libs/web-user/shared/src/lib/presentational/label/label.component';
import { FieldsetComponent } from 'libs/web-user/shared/src/lib/presentational/fieldset/fieldset.component';
const components = {
  label: LabelComponent,
  fieldset: FieldsetComponent,
};
@Component({
  selector: 'hospitality-bot-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  _formValues;

  @Input()
  settings = [];
  step = 0;
  panelOpenState: boolean[] = [];

  @ViewChildren('parentPanelContent', { read: ViewContainerRef })
  parentPanelContentContainer: QueryList<any>;

  @ViewChild('healthDiv', { static: false }) healthDiv: ElementRef;

  @Input()
  parentForm: FormGroup;

  healthDeclarationForm: FormGroup;
  currentParentContainer: ViewContainerRef;

  containerStack = [];

  constructor(
    private _parentFormService: ParentFormService,
    private _resolver: ComponentFactoryResolver,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }
  registerListeners() {
    this.listenForParentFormValues();
  }
  listenForParentFormValues() {
    this._parentFormService.parentFormValueAndValidity$.subscribe((data) => {
      this._formValues = data['value'];
      this.generateJson();
      this.getSettings();
    });
  }
  generateJson() {}

  ngAfterViewInit() {
    this.makeComponentsDynamic();
  }

  makeComponentsDynamic() {
    for (let panelIndex in this.settings) {
      if (this.settings[panelIndex].child.length) {
        if (this.settings[panelIndex].type == 'primary') {
          this.currentParentContainer = this.parentPanelContentContainer.toArray()[
            panelIndex
          ];

          this.generateChildComponents(
            this.settings[panelIndex].child,
            this.parentPanelContentContainer.toArray()[panelIndex]
          );
        } else if (this.settings[panelIndex].type == 'secondary') {
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
        };
        componentObj.instance.name = key;
        // componentObj.instance.name = config.component.key;
      }

      return componentObj;
    }
  }

  getSettings() {
    let data = [
      {
        title: 'Checkin Summary',
        description: '',
        type: 'primary',
        child: [
          {
            indexName: '1',
            indexStyle: '.',
            component: {
              label: '',
              master_label: 'Personal Details',
              value: '',
              style: {},
              options: '',
              contentType: '',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
            child: [
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: '',
                  master_label: 'Full Name (Primary)',
                  value: '',
                  style: '',
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '2',
                  type: 'label',
                  appearance: '',
                },
                child: [],
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: '',
                  master_label: 'Phone No.',
                  value: '',
                  style: '',
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '3',
                  type: 'label',
                  appearance: '',
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: '',
                  master_label: 'Email ID',
                  value: '',
                  style: '',
                  options: [],
                  contentType: '',
                  required: false,
                  order: 0,
                  key: '4',
                  type: 'label',
                  appearance: '',
                },
              },
            ],
          },
        ],
      },
    ];
    this.settings = data;
  }
}
