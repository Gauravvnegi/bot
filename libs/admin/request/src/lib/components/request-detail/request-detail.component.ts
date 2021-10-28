import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
  data = {};
  status = false;
  constructor(private _requestService: RequestService) {}

  ngOnInit(): void {}

  listenForSelectedRequest() {
    this._requestService.selectedRequest.subscribe((response) => {
      if (response) {
        this.data = response;
        this.status = true;
      } else {
        this.status = false;
      }
    });
  }
}
