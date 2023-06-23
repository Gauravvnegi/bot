import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.formService.reset();
  }
}
