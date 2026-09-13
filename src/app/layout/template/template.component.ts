import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './template.component.html'
})
export class TemplateComponent {}
