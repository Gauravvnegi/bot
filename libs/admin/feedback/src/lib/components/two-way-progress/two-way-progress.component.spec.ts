import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayProgressComponent } from './two-way-progress.component';

describe('TwoWayProgressComponent', () => {
  let component: TwoWayProgressComponent;
  let fixture: ComponentFixture<TwoWayProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoWayProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
