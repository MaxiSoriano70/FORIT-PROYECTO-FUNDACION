import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditFormCategoryComponent } from './modal-edit-form-category.component';

describe('ModalEditFormCategoryComponent', () => {
  let component: ModalEditFormCategoryComponent;
  let fixture: ComponentFixture<ModalEditFormCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditFormCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditFormCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
