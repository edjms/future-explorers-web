import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEstudiantes } from './tabla-estudiantes';

describe('TablaEstudiantes', () => {
  let component: TablaEstudiantes;
  let fixture: ComponentFixture<TablaEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEstudiantes],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaEstudiantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
