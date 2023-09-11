import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeGuestStatisticsComponent } from './type-guest-statistics.component';

describe('TypeGuestStatisticsComponent', () => {
  let component: TypeGuestStatisticsComponent;
  let fixture: ComponentFixture<TypeGuestStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeGuestStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeGuestStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
