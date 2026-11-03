import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignCollage } from './design-collage';

describe('DesignCollage', () => {
  let component: DesignCollage;
  let fixture: ComponentFixture<DesignCollage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignCollage],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignCollage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
