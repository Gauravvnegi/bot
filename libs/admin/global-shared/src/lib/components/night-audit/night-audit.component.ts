import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NightAuditService } from '../../services/night-audit.service';
import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';

@Component({
  selector: 'night-audit',
  templateUrl: './night-audit.component.html',
  styleUrls: ['./night-audit.component.scss'],
})
export class NightAuditComponent implements OnInit {
  constructor(private nightAuditService: NightAuditService) {}
  @Input() isSidebar = true;
  @Input() onClose = new EventEmitter();
  pageTitle = 'Night Audit';
  currentDate = new Date();
  loading = false;
  actionConfig: Pick<FormActionConfig, 'preLabel' | 'postLabel'> = {
    preLabel: '',
    postLabel: '',
  };

  ngOnInit(): void {}

  handleSave() {}

  close() {
    this.onClose.emit(false);
  }
}
