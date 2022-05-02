import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAssetComponent } from './import-asset.component';

describe('ImportAssetComponent', () => {
  let component: ImportAssetComponent;
  let fixture: ComponentFixture<ImportAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
