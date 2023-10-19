import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportServiceContainerComponent } from './import-service-container.component';

describe('ImportServiceContainerComponent', () => {
  let component: ImportServiceContainerComponent;
  let fixture: ComponentFixture<ImportServiceContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportServiceContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportServiceContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
