import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SnackBarService } from 'libs/shared/material/src';
import { IChat } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';
import * as FileSaver from 'file-saver';
import { openModal } from '@hospitality-bot/admin/shared';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicContentComponent } from 'libs/admin/shared/src/lib/components/dynamic-content/dynamic-content.component';

@Component({
  selector: 'hospitality-bot-media-chat',
  templateUrl: './media-chat.component.html',
  styleUrls: ['./media-chat.component.scss'],
})
export class MediaChatComponent implements OnInit {
  @ViewChild('imageRef') imageRef: TemplateRef<any>;
  @Input() message: IChat;
  dialogRef: DynamicDialogRef;
  isDownloading = false;

  constructor(
    private messageService: MessageService,
    private snackbarService: SnackBarService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  openImage() {
    const data: Partial<DynamicContentComponent> = {
      templateRef: this.imageRef,
    };
    this.dialogRef = openModal({
      config: {
        styleClass: 'no-style',
        data: data,
      },
      component: DynamicContentComponent,
      dialogService: this.dialogService,
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  downloadDoc() {
    this.isDownloading = true;
    this.messageService.downloadDocuments(this.message.url).subscribe(
      (blob) => {
        FileSaver.saveAs(blob, this.message.fileName || this.message.caption);
        this.isDownloading = false;
      },
      (error) => {
        this.snackbarService.openSnackBarAsText('Unable to download file');
        this.isDownloading = false;
      }
    );
  }
}
