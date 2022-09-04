import { TestBed } from '@angular/core/testing';

import { UserDataSharingService } from './user-data-sharing.service';

describe('UserDataSharingService', () => {
  let service: UserDataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
