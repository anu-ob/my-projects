import { TestBed } from '@angular/core/testing';

import { CorporateServiceService } from './corporate-service.service';

describe('CorporateServiceService', () => {
  let service: CorporateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
