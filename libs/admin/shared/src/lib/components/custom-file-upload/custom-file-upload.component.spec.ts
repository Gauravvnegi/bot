import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFileUploadComponent } from './custom-file-upload.component';

describe('CustomFileUploadComponent', () => {
  let component: CustomFileUploadComponent;
  let fixture: ComponentFixture<CustomFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
