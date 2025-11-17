import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditFormInformationComponent } from './modal-edit-form-information.component';

describe('ModalEditFormInformationComponent', () => {
  let component: ModalEditFormInformationComponent;
  let fixture: ComponentFixture<ModalEditFormInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditFormInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditFormInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
