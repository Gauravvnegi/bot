import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDatatableComponent } from './asset-datatable.component';

describe('AssetDatatableComponent', () => {
  let component: AssetDatatableComponent;
  let fixture: ComponentFixture<AssetDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
