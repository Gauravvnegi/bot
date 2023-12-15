import { Injectable } from '@angular/core';

const typeMapping = {
  image: '.png',
  pdf: '.pdf',
};

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  downloadFiles(files: DownloadParams[], fileType: FileType): void {
    files.forEach(({ url, fileName }, index) => {
      this.downloadFile({
        url: url,
        fileName: fileName ?? `${fileType}_${index}.${fileType}`,
        fileType,
      });
    });
  }

  downloadFile({
    url,
    fileType,
    fileName,
  }: DownloadParams & { fileType: FileType }): void {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName ?? `${fileType}.${fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}

type FileType = keyof typeof typeMapping;
type DownloadParams = {
  url: string;
  fileName?: string;
};
