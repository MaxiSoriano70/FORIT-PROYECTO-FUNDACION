import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditFormStudentComponent } from './modal-edit-form-student.component';

describe('ModalEditFormStudentComponent', () => {
  let component: ModalEditFormStudentComponent;
  let fixture: ComponentFixture<ModalEditFormStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditFormStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditFormStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
