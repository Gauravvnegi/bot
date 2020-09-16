import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplimentaryServiceComponent } from './complimentary-service.component';

describe('ComplimentaryServiceComponent', () => {
  let component: ComplimentaryServiceComponent;
  let fixture: ComponentFixture<ComplimentaryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplimentaryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplimentaryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
