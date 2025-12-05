import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDialogActions]',
})
export class DialogActions {
  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.classList.add('app-dialog-actions');
    this.el.nativeElement.classList.add('mt-6');
    this.el.nativeElement.classList.add('flex');
    this.el.nativeElement.classList.add('justify-end');
    this.el.nativeElement.classList.add('gap-2');
    this.el.nativeElement.classList.add('w-full');
  }
}
