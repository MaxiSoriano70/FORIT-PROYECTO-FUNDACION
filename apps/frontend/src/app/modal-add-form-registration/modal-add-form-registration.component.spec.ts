import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormRegistrationComponent } from './modal-add-form-registration.component';

describe('ModalAddFormRegistrationComponent', () => {
  let component: ModalAddFormRegistrationComponent;
  let fixture: ComponentFixture<ModalAddFormRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
