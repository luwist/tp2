import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageUploadButton } from './image-upload-button';

describe('ImageUploadButton', () => {
  let component: ImageUploadButton;
  let fixture: ComponentFixture<ImageUploadButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
