import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailChipListComponent } from './email-chip-list.component';

describe('EmailChipListComponent', () => {
  let component: EmailChipListComponent;
  let fixture: ComponentFixture<EmailChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailChipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
