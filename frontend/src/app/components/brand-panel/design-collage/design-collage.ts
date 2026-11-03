import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-design-collage',
  styleUrl: './design-collage.scss',
  templateUrl: './design-collage.html',
})
export class DesignCollage {
  protected readonly palette: readonly string[] = ['#6B4DF0', '#FF3D81', '#2EE6A8', '#FFD166'];
}
