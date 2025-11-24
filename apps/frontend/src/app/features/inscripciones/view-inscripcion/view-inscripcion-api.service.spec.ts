import { TestBed } from '@angular/core/testing';

import { ViewInscripcionApiService } from './view-inscripcion-api.service';

describe('ViewInscripcionApiService', () => {
  let service: ViewInscripcionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewInscripcionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
