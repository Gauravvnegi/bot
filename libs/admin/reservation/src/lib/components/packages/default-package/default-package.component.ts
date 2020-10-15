import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-default-package',
  templateUrl: './default-package.component.html',
  styleUrls: ['./default-package.component.scss'],
})
export class DefaultPackageComponent implements OnInit {
  @Input() parentForm;
  @Input() paidAmenityFG;
  @Input() config;
  @Input() index;

  constructor() {}

  ngOnInit(): void {}
}
