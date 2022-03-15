import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtAcrossExperienceComponent } from './art-across-experience.component';

describe('ArtAcrossExperienceComponent', () => {
  let component: ArtAcrossExperienceComponent;
  let fixture: ComponentFixture<ArtAcrossExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtAcrossExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtAcrossExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
