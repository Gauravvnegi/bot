import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FeedbackTableService } from '../../services/table.service';
import { Subscription } from 'rxjs';
import { UserService } from '@hospitality-bot/admin/shared';
import { Departmentpermission } from '../../data-models/feedback-card.model';
import {
  FlexibleConnectedPositionStrategy,
  OverlayRef,
  Overlay,
  BlockScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { FeedbackStatusFormComponent } from '../feedback-status-form/feedback-status-form.component';

@Component({
  selector: 'hospitality-bot-action-overlay',
  templateUrl: './action-overlay.component.html',
  styleUrls: ['./action-overlay.component.scss'],
})
export class ActionOverlayComponent implements OnInit {
  isOpen = false;
  type: string;
  globalQueries = [];
  @Input() userPermissions: Departmentpermission[];
  @Input() rowDataStatus;
  @Input() guestId;
  @Input() feedbackType;
  @Input() departmentName;
  @Output() openDetail = new EventEmitter();
  @Output() statusUpdate = new EventEmitter();
  feedbackStatusFG: FormGroup;
  private $subscription: Subscription = new Subscription();
  @ViewChild('overlayHost') overlayBtn: ElementRef;
  positionStrategy: FlexibleConnectedPositionStrategy;
  scrollStrategy: BlockScrollStrategy;
  overlayRef: OverlayRef;
  portal: ComponentPortal<FeedbackStatusFormComponent>;
  constructor(
    private tableService: FeedbackTableService,
    private _fb: FormBuilder,
    protected _snackbarService: SnackBarService,
    private userService: UserService,
    private overlay: Overlay
  ) {
    this.initFG();
  }

  initFG() {
    this.feedbackStatusFG = this._fb.group({
      comment: [''],
    });
  }

  ngOnInit(): void {
    this.statusType();
    this.listenForDisableMenu();
  }

  statusType() {
    if (this.rowDataStatus === 'TODO') this.type = 'INPROGRESS';
    else if (this.rowDataStatus === 'INPROGRESS') this.type = 'RESOLVED';
    else this.type = this.rowDataStatus;
  }

  handleButtonClick(event) {
    event.stopPropagation();
    if (this.positionStrategy) {
      this.removeOverlay();
    } else {
      this.isOpen = true;
      const { y } = this.overlayBtn.nativeElement.getBoundingClientRect();
      this.positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(this.overlayBtn)
        .withPush(false)
        .withFlexibleDimensions(false)
        .withLockedPosition(true)
        .withPositions([
          {
            offsetX: -8,
            offsetY: y < 250 ? 10 : -230,
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]);

      this.scrollStrategy = this.overlay.scrollStrategies.block();

      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy: this.positionStrategy,
        scrollStrategy: this.scrollStrategy,
      });
      this.portal = new ComponentPortal(FeedbackStatusFormComponent);
      const ref = this.overlayRef.attach(this.portal);
      ref.instance.guestId = this.guestId;
      ref.instance.rowDataStatus = this.rowDataStatus;
      ref.instance.getDepartmentAllowed = this.getDepartmentAllowed();
      ref.instance.feedbackStatusFG = this.feedbackStatusFG;
      ref.instance.statusUpdate.subscribe((response) => {
        this.statusUpdate.emit(response);
      });
      ref.instance.openDetail.subscribe((response) =>
        this.openDetailPage(response)
      );
    }
  }

  listenForDisableMenu() {
    this.tableService.$disableContextMenus.subscribe((response) => {
      if (response && this.isOpen) this.removeOverlay();
    });
  }

  removeOverlay() {
    this.overlayRef.detach();
    this.positionStrategy = undefined;
    this.isOpen = false;
  }

  updateStatus() {
    this.statusUpdate.emit({ statusType: this.type, id: this.guestId });
  }

  openDetailPage(event) {
    this.removeOverlay();
    this.openDetail.emit(event);
  }

  getDepartmentAllowed() {
    return (
      this.userPermissions &&
      this.userPermissions.filter((x) => x.department === this.departmentName)
        .length > 0
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
