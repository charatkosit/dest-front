import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EditData } from 'src/app/interfaces/EditData';

@Component({
  selector: 'app-office-edit',
  templateUrl: './office-edit.component.html',
  styleUrls: ['./office-edit.component.css']
})
export class OfficeEditComponent {
  @Input() editData: EditData = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    callAttribute: '',
    idOfficer: '',
    department: '',
    token: '',
    multiSelectFloor: ''
  };


  constructor(public modal: NgbActiveModal,
              private router: Router
  ) { }


  save() {
    console.log(`EditData: ${JSON.stringify(this.editData)}`);

    this.modal.close(this.editData);
    this.router.navigate(['/officers/officer-list']);
  }
}
