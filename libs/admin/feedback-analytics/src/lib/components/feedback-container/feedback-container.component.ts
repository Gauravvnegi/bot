import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-feedback-container',
  templateUrl: './feedback-container.component.html',
  styleUrls: ['./feedback-container.component.scss'],
})
export class FeedbackContainerComponent implements OnInit {
  welcomeMessage = 'Welcome To Heda Dashboard';
  navRoutes = [{ label: 'Heda Dashboard', link: './' }];
  constructor() {}

  ngOnInit(): void {}
}
