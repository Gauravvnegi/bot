import { Component } from '@angular/core';
import { FieldsetComponent } from 'libs/web-user/shared/src/lib/presentational/fieldset/fieldset.component';
import { FileUploadComponent } from 'libs/web-user/shared/src/lib/presentational/file-upload/file-upload.component';
import { InputComponent } from 'libs/web-user/shared/src/lib/presentational/input/input.component';
import { LabelComponent } from 'libs/web-user/shared/src/lib/presentational/label/label.component';
import { SelectBoxComponent } from 'libs/web-user/shared/src/lib/presentational/select-box/select-box.component';
import { HealthDeclarationComponent as BaseHealthDeclarationComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/health-declaration/health-declaration.component';
import { Temp000002RadioComponent } from 'libs/web-user/templates/temp000002/src/lib/presentational/temp000002-radio/temp000002-radio.component';
import { Temp000002TextareaComponent } from 'libs/web-user/templates/temp000002/src/lib/presentational/temp000002-textarea/temp000002-textarea.component';

const components = {
  radio: Temp000002RadioComponent,
  input: InputComponent,
  textarea: Temp000002TextareaComponent,
  label: LabelComponent,
  fieldset: FieldsetComponent,
  select: SelectBoxComponent,
  file: FileUploadComponent,
};
@Component({
  selector: 'hospitality-bot-health-declaration',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/health-declaration/health-declaration.component.html',
  styleUrls: ['./health-declaration.component.scss'],
})
export class HealthDeclarationComponent extends BaseHealthDeclarationComponent {
  protected healthComponents = components;
}
