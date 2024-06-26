import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfficerService } from 'src/app/services/officer.service';
import { OfficeEditComponent } from '../office-edit/office-edit.component';
import { EditData } from 'src/app/interfaces/EditData';
import { GeneralsService } from 'src/app/services/generals.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-officer-list',
  templateUrl: './officer-list.component.html',
  styleUrls: ['./officer-list.component.css']
})
export class OfficerListComponent implements OnInit {
  data: any[] = [];

  // สร้างตัวแปร editData เอาไว้รับข้อมูลที่แก้ไขแล้ว ที่ส่งมาจาก modal
  editData = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    callAttribute: '',
    idOfficer: '',
    employeeId: '',
    token: '',
    multiSelectFloor: ''
  };
  constructor(
    private officerService: OfficerService,
    private general: GeneralsService,
    private modalService: NgbModal,
    private router: Router,) { }

  ngOnInit(): void {
    this.loadData();
    this.initializeDataTable();
  }

  loadData(): void {
    this.officerService.getData().subscribe(data => {
      this.data = data;
      const table = $('#example1').DataTable();
      table.clear();
      table.rows.add(this.data);
      table.draw();
    });
  }

  initializeDataTable(): void {
    $(document).ready(() => {
      var table = $('#example1').DataTable({
        language: {
          lengthMenu: 'แสดง _MENU_ แถว',
          zeroRecords: 'ไม่พบข้อมูล',
          info: 'แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว',
          infoEmpty: 'ไม่มีข้อมูลที่ต้องการแสดง',
          infoFiltered: '(กรองจากทั้งหมด _MAX_ แถว)',
          search: 'ค้นหา:',
          paginate: {
            first: 'หน้าแรก',
            last: 'หน้าสุดท้าย',
            next: 'ถัดไป',
            previous: 'ก่อนหน้า'
          }
        },
        stateSave: true,
        data: this.data,
        columns: [
          { data: 'firstName', title: 'ชื่อ', className: "left-center" },
          { data: 'lastName', title: 'นามสกุล', className: "left-center" },
          { data: 'phone', title: 'โทรศัพท์', className: "left-center" },
          { data: 'idOfficer', title: 'บัตรพนักงาน', className: "left-center" },
          { data: 'token', title: 'หมายเลขบัตรอนุญาต', className: "left-center" },
          {
            data: 'multiSelectFloor', title: 'ติดต่อชั้น', className: "left-center",
            render: function (data: any, type: any, row: any) {
              return data === '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]' ? 'ไปได้ทุกชั้น' : data;
            }
          },
          {
            title: 'แก้ไข',
            className: 'text-center',
            data: null,
            render: function (data: any, type: any, row: any) {
              return `<button class="btn btn-info btn-edit" data-id="${row.id}">แก้ไข</button>
                 <button class="btn btn-danger btn-delete" data-id="${row.id}">ลบ</button>`;
            }
          },
        ]
      });

      $(document).on('click', '.btn-edit', (event: any) => {
        var editData = table.row($(event.target).parents('tr')).data();
        var id = $(event.target).data('id');
        console.log(`when edit click: ${id}, ${JSON.stringify(editData)}`);
        this.onEdit(id, editData);
      });

      $(document).on('click', '.btn-delete', (event: any) => {
        var id = $(event.target).data('id');
        console.log(`when delete click: ${id}`);
        this.onDelete(id);
      });
    });
  }

  onEdit(id: number, editData: EditData): void {
    console.log(`onEdit: ${JSON.stringify(editData)}`);
    // Add your logic for the edit action here
    const modalRef = this.modalService.open(OfficeEditComponent);
    modalRef.componentInstance.editData = { id, ...editData }

    //รับข้อมูลจาก modal ที่แก้ไขแล้ว ด้วยคำสั่ง this.modal.close(this.editData);
    modalRef.result.then((result) => {
      if (result !== undefined) {
        this.editData = result;
        this.officerService.update(id, this.editData).subscribe({
          next: () => {
            // Successfully deleted the officer, now update the table
            const table = $('#example1').DataTable();
            table.row((idx: any, data: any, node: any) => data.id === this.editData.id).data(this.editData).draw();
            this.general.onAlertUpdate();
          },
          error: (error) => { console.error('Error:', error); }
        });

      }
    }, (reason) => {
      console.log('Dismissed');
    });
  }



  deleteOfficer(id: number) {
    this.officerService.delete(id);
    this.officerService.getData().subscribe(data => { this.data = data })

  }


  onDelete(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "คุณแน่ใจ?",
      text: "ข้อมูลที่เลือกจะถูกลบออกจากระบบ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่ ลบ!",
      cancelButtonText: "ยกเลิก!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        //ทำการลบข้อมูลที่เลือก
        this.officerService.delete(id).subscribe({
          next: () => {
            // Successfully deleted the officer, now update the table
            const table = $('#example1').DataTable();
            table.rows((idx: any, data: any, node: any) => data.id === id).remove().draw();

            //แสดงข้อความเมื่อลบสำเร็จ
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "ข้อมูลถูกลบ ออกจากระบบ",
              icon: "success"
            });
          },
          error: (error) => {
            console.error('Error:', error);
          }
        });
      } else if (
        //แสดงข้อความเมื่อยกเลิกการลบ
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "ยกเลิกแล้ว",
          text: "ข้อมูลยังไม่ถูกลบ ออกจากระบบ",
          icon: "error"
        });
      }
    });
  }

}
