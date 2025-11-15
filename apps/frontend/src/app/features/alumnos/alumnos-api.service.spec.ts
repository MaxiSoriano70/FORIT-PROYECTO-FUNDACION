import { TestBed } from '@angular/core/testing';
import { AlumnosAPIService } from './alumnos-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AlumnosAPIService', () => {
  let service: AlumnosAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting]
    });
    service = TestBed.inject(AlumnosAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
