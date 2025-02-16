import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from 'src/app/models/student.model';

interface User {
  id?: number;
  fullName: string;
  designation: string;
  department: string;
};

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  @Output() userAdded = new EventEmitter<boolean>();
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.hideModal();
    this.closeModal.emit();
  }
  newUser: User = {id: undefined, fullName: '', designation: '', department: ''};
  

  addUser() {
    if (this.newUser.id && this.newUser.fullName && this.newUser.designation && this.newUser.department) {
      this.close();
      console.log('User added:', this.newUser);
      this.newUser = { id: undefined, fullName: '', designation: '', department: '' }; // Reset form
      this.userAdded.emit(true);
    }
  }

   hideModal() {
    const modalElement = document.getElementById('addUserModal');
    if (modalElement) {
      (modalElement as any).classList.remove('show');
      (modalElement as any).setAttribute('aria-hidden', 'true');
      (modalElement as any).setAttribute('style', 'display: none');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
    }
  }
}
