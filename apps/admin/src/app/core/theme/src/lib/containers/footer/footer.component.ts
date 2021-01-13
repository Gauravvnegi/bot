import { Component, OnInit } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'admin-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get currentDate() {
    return DateService.getCurrentDateWithFormat('YYYY');
  }
}
