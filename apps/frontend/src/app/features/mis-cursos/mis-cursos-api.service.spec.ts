import { TestBed } from '@angular/core/testing';

import { MisCursosApiService } from './mis-cursos-api.service';

describe('MisCursosApiService', () => {
  let service: MisCursosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisCursosApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
