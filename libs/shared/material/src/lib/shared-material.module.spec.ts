import { async, TestBed } from '@angular/core/testing';
import { SharedMaterialModule } from './shared-material.module';

describe('SharedMaterialModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedMaterialModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMaterialModule).toBeDefined();
  });
});
