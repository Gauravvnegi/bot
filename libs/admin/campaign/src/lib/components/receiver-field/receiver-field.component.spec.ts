import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverFieldComponent } from './receiver-field.component';

describe('ReceiverFieldComponent', () => {
  let component: ReceiverFieldComponent;
  let fixture: ComponentFixture<ReceiverFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
