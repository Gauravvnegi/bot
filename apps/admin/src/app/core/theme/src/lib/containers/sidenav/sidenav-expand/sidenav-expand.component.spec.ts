import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavExpandComponent } from './sidenav-expand.component';

describe('SidenavExpandComponent', () => {
  let component: SidenavExpandComponent;
  let fixture: ComponentFixture<SidenavExpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavExpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
