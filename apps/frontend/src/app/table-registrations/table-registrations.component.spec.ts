import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRegistrationsComponent } from './table-registrations.component';

describe('TableRegistrationsComponent', () => {
  let component: TableRegistrationsComponent;
  let fixture: ComponentFixture<TableRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
