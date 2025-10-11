import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recetas } from './recetas';

describe('Recetas', () => {
  let component: Recetas;
  let fixture: ComponentFixture<Recetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recetas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recetas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
