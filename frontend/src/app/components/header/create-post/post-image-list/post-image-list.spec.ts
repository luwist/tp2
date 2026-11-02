import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostImageList } from './post-image-list';

describe('PostImageList', () => {
  let component: PostImageList;
  let fixture: ComponentFixture<PostImageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostImageList],
    }).compileComponents();

    fixture = TestBed.createComponent(PostImageList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
