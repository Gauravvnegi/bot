import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatedCardComponent } from './seated-card.component';

describe('SeatedCardComponent', () => {
  let component: SeatedCardComponent;
  let fixture: ComponentFixture<SeatedCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatedCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
