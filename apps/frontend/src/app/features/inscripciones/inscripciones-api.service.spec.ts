import { TestBed } from '@angular/core/testing';

import { InscripcionesApiService } from './inscripciones-api.service';

describe('InscripcionesApiService', () => {
  let service: InscripcionesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscripcionesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
