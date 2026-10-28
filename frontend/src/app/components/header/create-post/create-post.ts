import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@openng/optimus-ui/dialog';

@Component({
  imports: [ReactiveFormsModule, DialogModule],
  selector: 'app-create-post',
  styleUrl: './create-post.scss',
  templateUrl: './create-post.html',
})
export class CreatePost {
  readonly visible = false;
}
