import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarCourseComponent } from './toolbar-course.component';

describe('ToolbarCourseComponent', () => {
  let component: ToolbarCourseComponent;
  let fixture: ComponentFixture<ToolbarCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
