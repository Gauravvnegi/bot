import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appImage]',
})
export class ImageDirective implements AfterViewInit, OnChanges {
  @Input() src: string;
  @Input() placeholderSrc = 'assets/images/placeholder.webp';

  constructor(private imageRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.loadImage(this.src);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.src && !changes.src.firstChange) {
      this.loadImage(changes.src.currentValue);
    }
  }

  private loadImage(src: string): void {
    if (src) {
      const img = new Image();
      img.onload = () => {
        this.setImage(src);
      };

      img.onerror = () => {
        // Set a placeholder image in case of loading failure
        this.setImage(this.placeholderSrc);
      };

      img.src = src;
    } else {
      // Set a placeholder image if src is not provided
      this.setImage(this.placeholderSrc);
    }
  }

  private setImage(src: string): void {
    // It's a good practice to check if the element still exists before setting the attribute
    if (this.imageRef?.nativeElement) {
      this.imageRef.nativeElement.setAttribute('src', src);
    }
  }
}
