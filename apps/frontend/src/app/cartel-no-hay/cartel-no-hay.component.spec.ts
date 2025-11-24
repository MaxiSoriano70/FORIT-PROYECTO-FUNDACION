import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartelNoHayComponent } from './cartel-no-hay.component';

describe('CartelNoHayComponent', () => {
  let component: CartelNoHayComponent;
  let fixture: ComponentFixture<CartelNoHayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartelNoHayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartelNoHayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
