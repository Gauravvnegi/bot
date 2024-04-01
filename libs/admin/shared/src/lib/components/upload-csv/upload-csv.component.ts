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
  defaultValue = {
    maxFileSize: 3145728,
    fileType: '.csv, .xls, .xlsx',
  };
  _fileUploadData;

  @Input() uploadStatus: boolean;

  @Input() label: string = 'Upload';
  @Input() pageType: string;
  @Input() documentType: string;
  @Input() isDisable = false;
  @Input('fileUploadData') set fileUploadData(value: {}) {
    this._fileUploadData = { ...this.defaultValue, ...value };
  }

  get uploadFileData() {
    return { ...this.defaultValue, ...this._fileUploadData };
  }

  @ViewChild('advancedfileinput') pInput: ElementRef;

  constructor() {}

  @Output()
  fileData = new EventEmitter();

  error = 'Invalid FileType';

  ngOnInit(): void {}

  onClick() {
    this.pInput.nativeElement.click();
  }

  onSelectFile(event) {
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const fileSize = file.size;

      if (fileSize <= +this.uploadFileData.maxFileSize) {
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

          // For Excel files (xlsx or xls)
          // You can use a library like exceljs or xlsx to handle Excel files
        };

        // Read the file as binary data
        reader.readAsText(file);
      } else {
        // Handle case where file size exceeds the maximum allowed size
      }
    }
  }

  checkFileType(extension: string) {
    return this.uploadFileData.fileType.includes(extension);
  }
}
