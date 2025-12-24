import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appDialogActions]',
})
export class DialogActions implements OnInit {
  private readonly el = inject(ElementRef);

  public ngOnInit(): void {
    this.el.nativeElement.classList.add('app-dialog-actions');
    this.el.nativeElement.classList.add('mt-6');
    this.el.nativeElement.classList.add('flex');
    this.el.nativeElement.classList.add('justify-end');
    this.el.nativeElement.classList.add('gap-2');
    this.el.nativeElement.classList.add('w-full');
  }
}
