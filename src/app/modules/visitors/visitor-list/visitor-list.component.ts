import { Component, OnInit } from '@angular/core';
import { GeneralsService } from 'src/app/services/generals.service';
import { VisitorService } from 'src/app/services/visitor.service';
declare var $: any;

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css']
})
export class VisitorListComponent implements OnInit {
  data: any[] = [];
  // dtOptions: DataTables.Settings = {};

 
  constructor(
    private visitorService: VisitorService,
    private generalService: GeneralsService
  ) {}


 
  ngOnInit(): void {

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   processing: true
    //   // คุณสามารถเพิ่มตัวเลือกอื่นๆ ตามต้องการ
    // };
    this.visitorService.getData().subscribe(data => {
      this.data = data;
      console.log(data)

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
            { data: 'firstName', title: 'ชื่อ', className: "text-center" },
            { data: 'lastName', title: 'นามสกุล', className: "text-center" },
            { data: 'phone', title: 'โทรศัพท์', className: "text-center" },
            { data: 'idCard', title: 'บัตรประชาชน', className: "text-center" },
            { data: 'token', title: 'หมายเลขบัตรอนุญาติ', className: "text-center" },
            { data: 'destFloor', title: 'ติดต่อชั้น', className: "text-center" },
            {
              title: 'แสดง',
              className: 'text-center',
              data: null,
              render: function (data: any, type: any, row: any) {
                console.log(`row is ${JSON.stringify(row.id)}`);
                return '<button class="btn btn-primary btn-details" data-id="' + row.id + '">รายละเอียด</button>';
              }
            },
          ]
        });
        $(document).on('click', '.btn-details', () => {
          var id = $(event?.target).data('id');

          console.log(`when click: ${id}`);

        });

      });
    })

    
  }




}
