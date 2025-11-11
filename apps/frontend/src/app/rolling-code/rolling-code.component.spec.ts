import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollingCodeComponent } from './rolling-code.component';

describe('RollingCodeComponent', () => {
  let component: RollingCodeComponent;
  let fixture: ComponentFixture<RollingCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollingCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollingCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
