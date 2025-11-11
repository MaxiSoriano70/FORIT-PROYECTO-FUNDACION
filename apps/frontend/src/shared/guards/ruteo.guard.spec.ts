import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { ruteoGuard } from './ruteo.guard';

describe('ruteoGuard', () => {
  const executeGuard: CanActivateFn = ruteoGuard();

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
