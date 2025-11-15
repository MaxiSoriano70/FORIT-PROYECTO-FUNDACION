import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormStudentComponent } from './modal-add-form-student.component';

describe('ModalAddFormStudentComponent', () => {
  let component: ModalAddFormStudentComponent;
  let fixture: ComponentFixture<ModalAddFormStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
