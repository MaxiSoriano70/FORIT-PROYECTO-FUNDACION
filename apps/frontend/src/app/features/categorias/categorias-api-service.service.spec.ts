import { TestBed } from '@angular/core/testing';

import { CategoriasApiService } from './categorias-api-service.service';

describe('CategoriasApiServiceService', () => {
  let service: CategoriasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
