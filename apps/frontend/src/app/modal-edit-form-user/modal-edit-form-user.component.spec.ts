import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditFormUserComponent } from './modal-edit-form-user.component';

describe('ModalEditFormUserComponent', () => {
  let component: ModalEditFormUserComponent;
  let fixture: ComponentFixture<ModalEditFormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditFormUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditFormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
