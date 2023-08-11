import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { StatCard } from '../../types/complaint.type';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddItemComponent } from 'libs/admin/request/src/lib/components/add-item/add-item.component';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';

@Component({
  selector: 'complaint-analytics',
  templateUrl: './complaint-analytics.component.html',
  styleUrls: ['./complaint-analytics.component.scss'],
})
export class ComplaintAnalyticsComponent implements OnInit {
  welcomeMessage = 'Welcome To Complaint Analytics';
  navRoutes = [{ label: 'Complaint Analytics', link: './' }];
  $subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private snackBarService: SnackBarService,
    private modalService: ModalService
  ) {}

  statCard = [
    {
      label: 'Avg Ticket/Day',
      score: '50',
      additionalData: '100',
      comparisonPercent: 100,
      color: '#31bb92',
    },
    {
      label: 'Avg Time Taken/Day',
      score: '10',
      additionalData: '5 Mins',
      comparisonPercent: 100,
      color: '#ef1d45',
    },
    {
      label: 'Agent Distribution',
      score: '50',
      color: '#4ba0f5',
    },
  ];

  ngOnInit(): void {}

  createServiceItem() {
    //to open add new item pop up

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '90vh';

    const addItemCompRef = this.modalService.openDialog(
      AddItemComponent,
      dialogConfig
    );

    this.$subscription.add(
      addItemCompRef.componentInstance.onClose.subscribe(() => {
        addItemCompRef.close();
      })
    );
  }

  raiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '90vh';

    const raiseRequestCompRef = this.modalService.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          raiseRequestCompRef.close();
        }
      )
    );
  }
}
