import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormCourseComponent } from './modal-add-form-course.component';

describe('ModalAddFormCourseComponent', () => {
  let component: ModalAddFormCourseComponent;
  let fixture: ComponentFixture<ModalAddFormCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
