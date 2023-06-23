import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanquetFormComponent } from './banquet-form.component';

describe('BanquetFormComponent', () => {
  let component: BanquetFormComponent;
  let fixture: ComponentFixture<BanquetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanquetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanquetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
