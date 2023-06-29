import { Component, Input, OnInit } from '@angular/core';
import { Option } from '../../types/form.type';
import { ConfigService, CountryCodeList } from '@hospitality-bot/admin/shared';
import { FormComponent } from '../../components/form-component/form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: [
    './phone-number.component.scss',
    '../../components/form-component/select/select.component.scss',
  ],
})
export class PhoneNumberComponent extends FormComponent {
  @Input() preControlName: string = 'cc';
  @Input() postControlName: string = 'phoneNumber';
  code: Option[] = [];
  label: string = 'Phone Number';

  constructor(
    private configService: ConfigService,
    public controlContainer: ControlContainer
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.getCountryCode();
    this.initInputControl();
  }

  getCountryCode() {
    this.loading = true;
    this.configService.getCountryCode().subscribe(
      (res) => {
        let data = new CountryCodeList().deserialize(res);
        data.records.forEach((element) => {
          element.label = element.label + ' (' + element.value + ')';
          element.value = element.value;
        });

        this.code = data.records;
      },
      () => {},
      this.handleFinal
    );
  }

  handleFinal = () => {
    this.loading = false;
  };
}
