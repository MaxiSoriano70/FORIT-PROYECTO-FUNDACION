import { TestBed } from '@angular/core/testing';
import { CursosAPIService } from './cursos-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CursosAPIService', () => {
  let service: CursosAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting]
    });
    service = TestBed.inject(CursosAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
