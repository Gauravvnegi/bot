import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportServiceComponent } from './import-service.component';

describe('ImportServiceComponent', () => {
  let component: ImportServiceComponent;
  let fixture: ComponentFixture<ImportServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
