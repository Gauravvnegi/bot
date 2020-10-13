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
export class ApplicationStatusComponent implements OnInit {
  private _formValues: any;

  @Input()
  settings = [];

  @Input()
  context: any;

  @ViewChild('healthDiv', { static: false }) healthDiv: ElementRef;

  @Input()
  parentForm: FormArray;

  @Input()
  config: any;

  currentParentContainer: ViewContainerRef;

  $subscription = new Subscription();
  isLoaderVisible = true;

  constructor(
    private _parentFormService: ParentFormService,
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
        })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  closeModal() {
    this._matDialog.closeAll();
  }

}
