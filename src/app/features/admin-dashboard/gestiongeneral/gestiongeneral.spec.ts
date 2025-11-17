import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestiongeneral } from './gestiongeneral';

describe('Gestiongeneral', () => {
  let component: Gestiongeneral;
  let fixture: ComponentFixture<Gestiongeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestiongeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gestiongeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
