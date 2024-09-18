import { Component, ElementRef, ViewChild } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @ViewChild('myModal') myModal!: ElementRef;

  openModal() {
    const modal = new bootstrap.Modal(this.myModal.nativeElement);
    modal.show();  // Bootstrap Modal API kullanarak modal açma
  }

  closeModal() {
    const modal = new bootstrap.Modal(this.myModal.nativeElement);
    modal.hide();  // Bootstrap Modal API kullanarak modal kapama
  }
}
