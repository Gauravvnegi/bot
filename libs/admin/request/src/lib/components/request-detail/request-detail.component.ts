import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InhouseData } from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
  data: InhouseData;
  status = false;
  statusList = [
    { label: 'To-Do', value: 'Immediate' },
    { label: 'Timeout', value: 'Timeout' },
    { label: 'Closed', value: 'Closed' },
  ];

  requestFG: FormGroup;
  constructor(
    private _requestService: RequestService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.listenForSelectedRequest();
    this.initFG();
  }

  listenForSelectedRequest() {
    this._requestService.selectedRequest.subscribe((response) => {
      if (response) {
        this.data = response;
        this.requestFG.patchValue({ status: response.action });
        this.status = true;
      } else {
        this.status = false;
      }
    });
  }

  initFG() {
    this.requestFG = this.fb.group({
      status: [''],
    });
  }

  checkForData() {
    return this.data && Object.keys(this.data).length;
  }
}
