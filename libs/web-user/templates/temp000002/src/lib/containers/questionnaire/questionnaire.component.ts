import { Component } from '@angular/core';
import { QuestionnaireComponent as BaseQuestionnaireComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/questionnaire/questionnaire.component';

@Component({
  selector: 'hospitality-bot-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent extends BaseQuestionnaireComponent {}
