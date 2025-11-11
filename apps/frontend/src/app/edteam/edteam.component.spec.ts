import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdteamComponent } from './edteam.component';

describe('EdteamComponent', () => {
  let component: EdteamComponent;
  let fixture: ComponentFixture<EdteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdteamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
