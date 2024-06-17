import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GeneralsService } from 'src/app/services/generals.service';


@Component({
  selector: 'app-regist',
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.css']
})
export class RegistComponent implements OnInit {

  user = {
    firstName: '',
    lastName: '',
    phone: '',
    idOfficer: '',
    token: '',
    multiSelectFloor: ''

  };

  constructor(
    private http: HttpClient,
    private generalService: GeneralsService) { }

  ngOnInit(): void {
  }

  floors = [1, 2, 3, 4, 5];


  // ตรวจสอบว่าเช็คบ็อกซ์ของชั้นเลข floor ถูกเลือกหรือไม่
  isChecked(floor: number): boolean {
    return this.floors.includes(floor);
  }

  updateMultiSelectFloor() {
    this.user.multiSelectFloor = this.floors
      .filter(floor => this.isChecked(floor))
      .join(', ');
  }

  addBrackets(input: string): string {
    const numbersArray = input.split(',').map(Number);
    return '[' + numbersArray.join(',') + ']';
  }
  onSubmit() {
    // เตรียมข้อมูล
    this.user.multiSelectFloor = this.addBrackets(this.user.multiSelectFloor)

    // ทำการส่งข้อมูล
    const url = 'http://127.0.0.1:3000/api/officers'
    this.http.post(url, this.user).subscribe({
      next: response => {
        console.log(response);
        this.resetForm();
      },
      error: error => {
        console.error(error);
      }
    });
    // console.log(JSON.stringify(this.user))
    this.generalService.onAlertSave();
  }

  resetForm() {
    this.user = {
      firstName: '',
      lastName: '',
      phone: '',
      idOfficer: '',
      token: '',
      multiSelectFloor: ''
    };
  }


}
