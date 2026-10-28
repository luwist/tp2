import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardSkeleton } from './post-card-skeleton';

describe('PostCardSkeleton', () => {
  let component: PostCardSkeleton;
  let fixture: ComponentFixture<PostCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardSkeleton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
