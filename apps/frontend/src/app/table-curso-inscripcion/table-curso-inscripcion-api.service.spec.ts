import { TestBed } from '@angular/core/testing';

import { TableCursoInscripcionApiService } from './table-curso-inscripcion-api.service';

describe('TableCursoInscripcionApiService', () => {
  let service: TableCursoInscripcionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableCursoInscripcionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
