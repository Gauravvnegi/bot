import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonVariant } from '../../types/form.type';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'hospitality-bot-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent implements OnInit {
  @Input() uploadStatus: boolean;

  @Input() label: string = null;
  @Input() pageType: string;
  @Input() severity: ButtonSeverity = 'primary';
  @Input() variant: ButtonVariant = 'contained';
  @Input() documentType: string;
  @Input() isDisable = false;
  @Input() chooseIcon: string = 'pi-arrow-down';
  @Input() uploadIcon: string = 'pi-arrow-down';
  @Input() maxFileSize: number = 3145728;
  @Input() fileType: string = '.csv, .xls, .xlsx';
  @Input() isAuto: boolean = true;
  @ViewChild('upload') upload: FileUpload;

  constructor() {}

  @Output()
  fileData = new EventEmitter();
  ngOnInit(): void {}

  onSelectFile(event) {
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const fileSize = file.size;

      if (fileSize <= +this.maxFileSize) {
        const reader = new FileReader();
        reader.onload = (_event) => {
          const binaryString = reader.result as string; // This will contain the binary data

          // For CSV files
          const rows = binaryString.split('\n'); // Split the CSV content into rows
          const nonEmptyRows = rows.filter((row) => row.trim().length > 0); // Filter out empty rows
          const filteredContent = nonEmptyRows.join('\n'); // Join non-empty rows back into CSV content

          const docsType = this.extractDocumentType(file.name);

          // Emit the file data along with other parameters
          const data = {
            file: file,
            pageType: this.pageType,
            documentType: this.documentType ?? docsType,
            binaryData: filteredContent, // Include the filtered binary data in the emitted data
          };
          this.fileData.emit(data);
        };

        // Read the file as binary data
        reader.readAsText(file);
        this.resetFileInput();
      } else {
        // Handle case where file size exceeds the maximum allowed size
      }
    }
  }

  checkFileType(extension: string) {
    return this.fileType.includes(extension);
  }
  resetFileInput() {
    this.upload.clear();
  }

  extractDocumentType(url) {
    // Convert the URL to lowercase to make the comparison case-insensitive
    var lowerCaseUrl = url.toLowerCase();

    // Check if the URL contains keywords indicating an image
    if (
      lowerCaseUrl.includes('png') ||
      lowerCaseUrl.includes('jpeg') ||
      lowerCaseUrl.includes('jpg') ||
      lowerCaseUrl.includes('gif')
    ) {
      return 'IMAGE';
    }

    // Check if the URL contains keywords indicating a video
    if (
      lowerCaseUrl.includes('mp4') ||
      lowerCaseUrl.includes('avi') ||
      lowerCaseUrl.includes('mov') ||
      lowerCaseUrl.includes('wmv')
    ) {
      return 'VIDEO';
    }

    // Check if the URL contains keywords indicating an audio file
    if (
      lowerCaseUrl.includes('mp3') ||
      lowerCaseUrl.includes('wav') ||
      lowerCaseUrl.includes('ogg') ||
      lowerCaseUrl.includes('aac')
    ) {
      return 'AUDIO';
    }

    // If the URL doesn't match any known types, return "unknown"
    return 'DOCUMENT';
  }
}
export type ButtonSeverity = 'reset' | 'secondary' | 'primary';
