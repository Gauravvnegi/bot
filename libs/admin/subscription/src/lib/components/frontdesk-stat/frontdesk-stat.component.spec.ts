import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontdeskStatComponent } from './frontdesk-stat.component';

describe('FrontdeskStatComponent', () => {
  let component: FrontdeskStatComponent;
  let fixture: ComponentFixture<FrontdeskStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontdeskStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontdeskStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
