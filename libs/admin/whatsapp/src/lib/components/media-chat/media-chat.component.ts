import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { IChat } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-media-chat',
  templateUrl: './media-chat.component.html',
  styleUrls: ['./media-chat.component.scss'],
})
export class MediaChatComponent implements OnInit {
  @ViewChild('imageRef') imageRef: TemplateRef<any>;
  @Input() message: IChat;
  dialogRef: MatDialogRef<any>;
  isDownloading = false;

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  openImage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'image-popup';
    this.dialogRef = this.modalService.openDialogWithRef(
      this.imageRef,
      dialogConfig
    );
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
