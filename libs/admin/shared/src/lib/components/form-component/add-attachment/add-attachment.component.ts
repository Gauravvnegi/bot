import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormComponent } from '../form.components';
import { Option } from '../../../types/form.type';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-add-attachment',
  templateUrl: './add-attachment.component.html',
  styleUrls: ['./add-attachment.component.scss']
})
export class AddAttachmentComponent extends FormComponent {
  menuClass = 'p-multiselect-items-wrapper';
  searchInputClass = 'p-multiselect-filter';
  
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() isDisable = false;
  @ViewChild('fileInput') input: ElementRef;

  constructor(controlContainer: ControlContainer) {
    super(controlContainer);
  }

  dictionary: Record<string, string> = {};

  handleClear(value: string) {
    if (!this.isDisabled)
      this.inputControl.setValue(
        (this.inputControl.value as string[])?.filter((item) => item !== value)
      );
  }

  set options(input: Option[]) {
    this.menuOptions = input;
    this.dictionary = input?.reduce((prev, { label, value }) => {
      prev[value] = label;
      return prev;
    }, {});
  }

  onAddAttachment(){
    this.input.nativeElement.click();
  }

  onSelectFile(event){
    this.onClick.emit(event);
  }

  ngOnInit(): void {
  }
}
