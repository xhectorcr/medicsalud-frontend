import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Especialistas } from './especialistas';

describe('Especialistas', () => {
  let component: Especialistas;
  let fixture: ComponentFixture<Especialistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Especialistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Especialistas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
