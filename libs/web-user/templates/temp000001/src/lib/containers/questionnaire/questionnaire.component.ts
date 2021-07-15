import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {
  @Input() externalLink: string;
  constructor() {}

  ngOnInit(): void {}

  openQuestionnaire() {
    window.open(this.externalLink, '_blank');
  }
}
