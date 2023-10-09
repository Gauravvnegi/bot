import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsAcrossDepartmentsComponent } from './nps-across-departments.component';

describe('NpsAcrossDepartmentsComponent', () => {
  let component: NpsAcrossDepartmentsComponent;
  let fixture: ComponentFixture<NpsAcrossDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsAcrossDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsAcrossDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
