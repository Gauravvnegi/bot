import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { Cancelable, debounce, map } from 'lodash';
import {
  Alignment,
  FormProps,
  InputType,
  InputVariant,
  Option,
} from '../../types/form.type';

@Component({ template: '' })
export class FormComponent implements OnInit {
  menuOptionEl: Element;

  inputControl: AbstractControl; // Input Control

  /* Default Settings Props */
  fontSize = '16px';
  float = false; // for floatable label
  showClear = false;
  placeholder: string = '';
  variant: InputVariant = 'outlined';
  alignment: Alignment = 'vertical';
  errorMessages: Record<string, string> = {
    // error messages with appropriate error-key
    required: 'This is a required field.',
  };
  tabIndex = ''; // Removes tab focus in input
  type: InputType = 'text';
  dropdownIcon = 'pi pi-chevron-down'; // Arrow icon for dropdown inputs
  isAsync = false; // To register load-more/search option query
  additionalInfo: string = ''; // Info icon text
  subtitle = ''; // subtitle text
  createPrompt: string; // To add cta in dropdown
  inputPrompt: string; // To add input-save after add cta
  isAutoFocusFilter: boolean = true; // To focus on search input

  @Output() onCreate = new EventEmitter(); // createPrompt on click emitter
  @Output() onFocus = new EventEmitter(); //handle focus
  @Output() onBlur = new EventEmitter(); //handle focus
  @Output() onKeyDown = new EventEmitter<Event>();

  /* Main Props */
  menuOptions: Option[] = [];
  isDisabled = false;
  isLoading = false;
  showLabel = true;

  /*** Class Input to for attach api event */
  menuClass: string;
  searchInputClass: string;

  /** Internal setting values */
  searchText: string;

  /** To handle api pagination & search call */
  @Input() stopEmission = false;
  @Output() paginate = new EventEmitter();
  @Output() onSearch = new EventEmitter<string>();
  @Input() label: string;
  @Input() controlName: string;

  /**
   * To set menu options options
   */
  @Input() set options(input: Option[]) {
    if ((!this.menuOptions || !this.menuOptions.length) && !!input?.length) {
      // Registration required as menu class changed when there is no menu Item
      setTimeout(() => {
        this.onMenuOpen();
      }, 500);
    }
    this.menuOptions = input;
  }

  /**
   * To disable input
   */
  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  /**
   * To show loading
   */
  @Input() set loading(value: boolean) {
    if (value) {
      this.dropdownIcon = 'pi pi-spin pi-spinner';
    } else {
      this.dropdownIcon = 'pi pi-chevron-down';
    }
    this.isLoading = value;
  }

  /**
   * To update the value of default [setting] props
   */
  @Input() set props(values: FormProps) {
    map(values, (val, key) => {
      this[key] = val;
    });
  }

  constructor(public controlContainer: ControlContainer) {}

  // Do add these function call if overridden
  ngOnInit(): void {
    this.initInputControl();
  }

  /**
   * Init Input Control
   */
  initInputControl(controlName?: string) {
    this.inputControl = this.controlContainer.control.get(
      controlName ? controlName : this.controlName
    );
    this.addRequiredAsterisk();
  }

  handleBlur() {
    // this.onBlur.emit();
  }

  handleFocus() {
    this.onFocus.emit();
  }

  handleKeyDown(event: Event) {
    this.onKeyDown.emit(event);
  }

  /**
   * To get all the required props [add value in return if new prop is added]
   * @returns all the required prop
   */
  get props(): FormProps {
    return {
      float: this.float,
      variant: this.variant,
      alignment: this.alignment,
      showClear: this.showClear,
      errorMessages: this.errorMessages,
      fontSize: this.fontSize,
      placeholder: this.placeholder,
      isAsync: this.isAsync,
      dropdownIcon: this.dropdownIcon,
      additionalInfo: this.additionalInfo,
      type: this.type,
      subtitle: this.subtitle,
      isAutoFocusFilter: this.isAutoFocusFilter,
    };
  }

  /**
   * Input wrapper classes
   */
  wrapperNgClasses(hideSpinner: boolean) {
    return {
      // 'p-input-icon-right': this.isLoading,
      'p-float-label': this.float,
      wrapper__vertical: this.alignment === 'vertical',
      wrapper__horizontal: this.alignment === 'horizontal',
      'custom-disabled': this.isDisabled,
      'hide-spinner': hideSpinner,
    };
  }

  /**
   * Input classes
   */
  get inputNgClasses() {
    return {
      input__static: this.label && this.alignment === 'vertical',
      input__standard: this.variant === 'standard',
      input__outlined: this.variant === 'outlined',
      input__error: this.error,
      input__disabled: this.isDisabled,
    };
  }

  /**
   * Get Icon class
   */
  get iconNgClass() {
    return {
      icon: true,
      icon__static: this.label && !this.float,
      icon__float: this.label && this.float,
    };
  }

  /**
   * Get error generated by form control
   */
  get error() {
    const errors = this.controlContainer.control.get(this.controlName)?.errors;
    if (
      errors &&
      this.controlContainer.control.get(this.controlName)?.touched
    ) {
      const priorityError = Object.keys(errors)[0];
      return this.errorMessages[priorityError];
    }
    return false;
  }

  /**
   * @function addRequiredAsterisk to add [*] in required field
   */
  addRequiredAsterisk() {
    const validators = this.inputControl?.validator;
    const isRequired =
      validators && validators({} as AbstractControl)?.required;
    if (this.label && isRequired) {
      this.label = this.label + ' *';
    }
  }

  /**
   * @function addCreateNewCta to add a cta if createPrompt is required
   */
  addCreateNewCta = () => {
    const id = `${this.controlName}-dropdown-cta`;
    if (!document.getElementById(id) && this.createPrompt) {
      const newDiv = document.createElement('div');
      newDiv.innerText = this.createPrompt;
      newDiv.addEventListener('click', (event: MouseEvent) => {
        if (!this.inputPrompt) {
          this.onCreate.emit();
        } else {
          event.stopPropagation();
          this.addCreateInputCta();
          newDiv.style.display = 'none';
        }
      });
      newDiv.id = id;
      newDiv.className = 'dropdown-action-cta'; // styling class
      const menu = document.querySelector(`.${this.menuClass}`);
      menu?.parentElement.appendChild(newDiv);
    }
  };

  addCreateInputCta = () => {
    const id = `${this.controlName}-dropdown-input-cta`;
    if (!document.getElementById(id) && this.createPrompt) {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `
      <div style="position: relative; flex-basis: 85%;">
      <input style="width: 100%; height: 100%" type="text" id="myInput" pInputText maxlength="30" placeholder="${this.inputPrompt}">
           <small id="subtitle" style="  position: absolute; bottom: 0.7em;right: 0.8em;font-size: 1em; color: lightgray;"></small>

      </div>
      <button id="myButton" onclick="myFunction()">Save</button>

 `;
      const maxLength = 30;
      newDiv.id = id;
      newDiv.className = 'dropdown-input-action-cta'; // styling class
      const menu = document.querySelector(`.${this.menuClass}`);
      menu?.parentElement.appendChild(newDiv);

      const input = document.getElementById('myInput') as HTMLInputElement;
      const button = document.getElementById('myButton');

      const subtitle = document.getElementById('subtitle');
      subtitle.innerHTML = `0/${maxLength}`;

      input.addEventListener('input', () => updateWordCount());

      const updateWordCount = () => {
        const currentTextLength = input.value.length;
        subtitle.innerHTML = `${currentTextLength}/${maxLength}`;
      };

      newDiv.focus();

      input.addEventListener('click', (event: MouseEvent) => {
        event.stopPropagation();
      });
      button.addEventListener('click', () => {
        this.onCreate.emit(input.value);
      });
    }
  };

  /**
   * @function onMenuOpen To Attach search and pagination api
   */
  onMenuOpen = () => {
    this.addCreateNewCta();
    if (!this.isAsync) return;

    let debounceCall: (() => void) & Cancelable;

    const registerScroll = () => {
      const menu = document.querySelector(`.${this.menuClass}`);

      menu?.addEventListener('scroll', () => {
        if (this.stopEmission) return;
        if (
          !this.isLoading &&
          !this.searchText &&
          menu.scrollHeight - 251 < menu.scrollTop
        ) {
          this.paginate.emit();
        }
      });
    };

    const registerSearch = () => {
      const input = document.querySelector(`.${this.searchInputClass}`);

      input?.addEventListener('input', (event: InputEvent) => {
        if (this.stopEmission) return;
        this.searchText = event.target['value'];
        debounceCall?.cancel();
        debounceCall = debounce(() => {
          this.onSearch.emit(this.searchText);
        }, 500);
        debounceCall();
      });
    };

    if (!this.stopEmission) {
      registerScroll();
      registerSearch();
    }
  };

  /**
   * @function onMenuClose To trigger on close
   */
  onMenuClose() {
    if (this.searchText) {
      // empty search value trigger on menu close
      this.onSearch.emit('');
      this.searchText = '';
    }
    this.onBlur.emit();
  }
}
