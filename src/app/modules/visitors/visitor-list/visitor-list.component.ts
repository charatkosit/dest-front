import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GeneralsService } from 'src/app/services/generals.service';
import { VisitorService } from 'src/app/services/visitor.service';
declare var $: any;

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css']
})
export class VisitorListComponent implements OnInit, OnDestroy {
  data: any[] = [];
  // dtOptions: DataTables.Settings = {};


  constructor(
    private visitorService: VisitorService,
    private generalService: GeneralsService
  ) { }



  ngOnInit(): void {
    this.loadData();

  }

 private loadData(): void{
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
        order: [[6, 'desc']], // เรียงลำดับตามเวลาเข้า
        columns: [
          { data: 'firstName', title: 'ชื่อ', className: "text-center" },
          { data: 'lastName', title: 'นามสกุล', className: "text-center" },
          { data: 'phone', title: 'โทรศัพท์', className: "text-center" },
          { data: 'idCard', title: 'บัตรประชาชน', className: "text-center" },
          { data: 'token', title: 'บัตรอนุญาติ', className: "text-center" },
          { data: 'destFloor', title: 'ติดต่อชั้น', className: "text-center" },
          {
            data: 'checkIn', title: 'เวลาเข้า', className: "text-center",
            render: function (data: any) {
              if (data) {
                var date = new Date(data);
                return date.toTimeString().split(' ')[0];
              }
              return '';
            }
          },
          {
            title: 'สถานะ',
            className: 'text-center',
            data: null,
            render: function (data: any, type: any, row: any) {
              console.log(`row is ${JSON.stringify(row.token)}`);
              if (row.checkOut == null) {
                return '<button class="btn btn-warning btn-returnCard" data-token="' + row.token + '">รอคืนบัตร</button>';
              } else {
                return '<button class="btn btn-default btn-returnCard" data-token="' + row.token + '" disabled>คืนแล้ว</button>';
              }
            }
          },
        ]
      });
      $(document).on('click', '.btn-returnCard', () => {
        var token = $(event?.target).data('token');
        console.log(`when btn-retrunCard click: ${token}`);
        this.onCheckOut(token);

      });
    });
  })
 }
  ngOnDestroy(): void {
    try {
      // Your cleanup code or method calls
      this.cleanup();
    } catch (error) {
      console.error('Error during ngOnDestroy:', error);
    }
  }

  private cleanup(): void {
    // Cleanup logic here
    console.log('Cleaning up resources...');
  }

  private reloadDataTable(): void {
    this.visitorService.getData().subscribe(data => {
      this.data = data;
      var table = $('#example1').DataTable();
      table.clear();
      table.rows.add(this.data);
      table.draw();
    });
  }

  onCheckOut(token: string): void {
    const updateVisitor$ = this.visitorService.updateVisitor(token);
    const checkout$ = this.visitorService.checkout(token);

    forkJoin([updateVisitor$, checkout$]).subscribe({
      next: ([updateVisitorData, checkoutData]) => {
        console.log(`updateVisitor data: ${JSON.stringify(updateVisitorData)}`);
        console.log(`checkout data: ${JSON.stringify(checkoutData)}`);
        this.generalService.showSuccess('คืนบัตรสำเร็จ');

        // Reload the data table
        this.reloadDataTable();
      },
      error: (error) => {
        console.log(`error: ${JSON.stringify(error)}`);
        this.generalService.showError('คืนบัตรไม่สำเร็จ');
      }
    });

  }




}
