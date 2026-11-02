import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostImageGallery } from './post-image-gallery';

describe('PostImageGallery', () => {
  let component: PostImageGallery;
  let fixture: ComponentFixture<PostImageGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostImageGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(PostImageGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
