import { TestBed } from '@angular/core/testing';

import { PlanvisitService } from './planvisit.service';

describe('PlanvisitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanvisitService = TestBed.get(PlanvisitService);
    expect(service).toBeTruthy();
  });
});
