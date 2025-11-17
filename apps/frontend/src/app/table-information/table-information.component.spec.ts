import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInformationComponent } from './table-information.component';

describe('TableInformationComponent', () => {
  let component: TableInformationComponent;
  let fixture: ComponentFixture<TableInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
