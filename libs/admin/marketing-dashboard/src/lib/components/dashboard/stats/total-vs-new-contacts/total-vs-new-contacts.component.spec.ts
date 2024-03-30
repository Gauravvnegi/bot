import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVsNewContactsComponent } from './total-vs-new-contacts.component';

describe('TotalVsNewContactsComponent', () => {
  let component: TotalVsNewContactsComponent;
  let fixture: ComponentFixture<TotalVsNewContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalVsNewContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalVsNewContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
