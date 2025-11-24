import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarRegistrationComponent } from './toolbar-registration.component';

describe('ToolbarRegistrationComponent', () => {
  let component: ToolbarRegistrationComponent;
  let fixture: ComponentFixture<ToolbarRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
