import { TestBed } from '@angular/core/testing';

import { TableInformationApiService } from './table-information-api.service';

describe('TableInformationApiService', () => {
  let service: TableInformationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableInformationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
