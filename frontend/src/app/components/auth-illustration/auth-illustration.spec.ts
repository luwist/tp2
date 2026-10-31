import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthIllustration } from './auth-illustration';

describe('AuthIllustration', () => {
  let component: AuthIllustration;
  let fixture: ComponentFixture<AuthIllustration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthIllustration],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthIllustration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
