import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarCategoryComponent } from './toolbar-category.component';

describe('ToolbarCategoryComponent', () => {
  let component: ToolbarCategoryComponent;
  let fixture: ComponentFixture<ToolbarCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
