import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionExpiringDialog } from './session-expiring-dialog';

describe('SessionExpiringDialog', () => {
  let component: SessionExpiringDialog;
  let fixture: ComponentFixture<SessionExpiringDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiringDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiringDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
