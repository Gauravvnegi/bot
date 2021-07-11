import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  openQuestionnaire() {
    window.open('https://www.google.com', '_blank');
  }
}
