import { TestBed } from '@angular/core/testing';
import { UsuariosApiService } from './usuarios-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsuariosApiService', () => {
  let service: UsuariosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting]
    });
    service = TestBed.inject(UsuariosApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
