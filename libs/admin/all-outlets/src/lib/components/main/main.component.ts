import { Component, OnInit } from '@angular/core';
import { OutletFormService } from '../../services/outlet-form.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private OutletFormServe: OutletFormService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.OutletFormServe.resetOutletFormData();
  }
}
