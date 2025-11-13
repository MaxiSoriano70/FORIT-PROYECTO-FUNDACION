import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddFormUserComponent } from './modal-add-form-user.component';

describe('ModalAddFormUserComponent', () => {
  let component: ModalAddFormUserComponent;
  let fixture: ComponentFixture<ModalAddFormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddFormUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddFormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
