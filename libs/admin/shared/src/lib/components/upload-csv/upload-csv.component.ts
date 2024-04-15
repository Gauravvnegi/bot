import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'hospitality-bot-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent implements OnInit {
  @Input() uploadStatus: boolean;

  @Input() label: string = 'Upload';
  @Input() pageType: string;
  @Input() documentType: string;
  @Input() isDisable = false;
  @Input() chooseIcon: string = 'pi-arrow-down';
  @Input() uploadIcon: string = 'pi-arrow-down';
  @Input() maxFileSize: number = 3145728;
  @Input() fileType: string = '.csv, .xls, .xlsx';
  @Input() isAuto: boolean = true;

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

          // Emit the file data along with other parameters
          const data = {
            file: file,
            pageType: this.pageType,
            documentType: this.documentType,
            binaryData: filteredContent, // Include the filtered binary data in the emitted data
          };
          this.fileData.emit(data);
        };

        // Read the file as binary data
        reader.readAsText(file);
      } else {
        // Handle case where file size exceeds the maximum allowed size
      }
    }
  }

  checkFileType(extension: string) {
    return this.fileType.includes(extension);
  }
}
