import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'pnr',
  template: `<div #dynamicContent></div>`,
})
export class PNRStatusComponent {
  @Input() content: string;
  @ViewChild('dynamicContent', { static: false }) dynamicContent: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.setProperty(
      this.dynamicContent.nativeElement,
      'innerHTML',
      this.content
    );
  }
}
