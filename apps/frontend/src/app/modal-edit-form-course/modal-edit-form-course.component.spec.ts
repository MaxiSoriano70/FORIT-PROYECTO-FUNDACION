import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditFormCourseComponent } from './modal-edit-form-course.component';

describe('ModalEditFormCourseComponent', () => {
  let component: ModalEditFormCourseComponent;
  let fixture: ComponentFixture<ModalEditFormCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditFormCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditFormCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
