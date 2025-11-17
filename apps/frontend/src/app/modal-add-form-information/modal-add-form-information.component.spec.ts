import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormInformationComponent } from './modal-add-form-information.component';

describe('ModalAddFormInformationComponent', () => {
  let component: ModalAddFormInformationComponent;
  let fixture: ComponentFixture<ModalAddFormInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
