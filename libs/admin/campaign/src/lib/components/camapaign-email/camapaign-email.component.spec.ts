import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamapaignEmailComponent } from './camapaign-email.component';

describe('CamapaignEmailComponent', () => {
  let component: CamapaignEmailComponent;
  let fixture: ComponentFixture<CamapaignEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamapaignEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamapaignEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
