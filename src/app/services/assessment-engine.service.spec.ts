import { TestBed } from '@angular/core/testing';

import { AssessmentEngineService } from './assessment-engine.service';

describe('AssessmentEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessmentEngineService = TestBed.get(AssessmentEngineService);
    expect(service).toBeTruthy();
  });
});
