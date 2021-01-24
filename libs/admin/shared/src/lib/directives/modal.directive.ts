import { Directive, Input, OnInit, HostListener } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ReservationDatatableComponent } from 'libs/admin/dashboard/src/lib/components/reservation-datatable/reservation-datatable.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';

@Directive({ selector: '[modal-open]' })
export class ModalDirective implements OnInit {
  @Input('modal-open') data: any;

  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  @HostListener('click') onClick() {
    if (this.data.type === 'reservation') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '100%';
      const detailCompRef = this.modalService.openDialog(
        ReservationDatatableComponent,
        dialogConfig
      );

      detailCompRef.componentInstance.tabFilterItems = this.data.tabFilterItems;
      detailCompRef.componentInstance.tabFilterIdx = 0;
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // remove loader for detail close
        detailCompRef.close();
      });
    }
  }
}
