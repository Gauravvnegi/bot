import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appImage]',
})
export class ImageDirective implements AfterViewInit {
  @Input() src;
  @Input() placeholderSrc = 'assets/images/placeholder.webp';

  constructor(private imageRef: ElementRef) {}

  ngAfterViewInit(): void {
    const img = new Image();
    img.onload = () => {
      this.setImage(this.src);
    };

    img.onerror = () => {
      // Set a placeholder image
      this.setImage(this.placeholderSrc);
    };

    img.src = this.src;
  }

  private setImage(src: string) {
    this.imageRef.nativeElement.setAttribute('src', src);
  }
}
