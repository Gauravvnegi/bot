import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildMainComponent } from './child-main.component';

describe('ChildMainComponent', () => {
  let component: ChildMainComponent;
  let fixture: ComponentFixture<ChildMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
