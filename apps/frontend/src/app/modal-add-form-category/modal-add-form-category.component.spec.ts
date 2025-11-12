import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormCategoryComponent } from './modal-add-form-category.component';

describe('ModalAddFormCategoryComponent', () => {
  let component: ModalAddFormCategoryComponent;
  let fixture: ComponentFixture<ModalAddFormCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
