import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class GeneralsService {
 

  constructor() { }




  convertBase64ToImageURL(base64: string): string {
    // แปลง Base64 เป็น Blob
    const byteString = window.atob(base64.split(',')[1]);
    const mimeType = base64.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: mimeType });

    // สร้าง URL จาก Blob
    return URL.createObjectURL(blob);
  }



  onAlertSave() {
    $(function () {
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ'
      });
    });
  }

  onAlertDelete() {
    $(function () {
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        icon: 'success',
        title: 'ลบสำเร็จ'
      });
    });
  }

  onAlertDeleteNew(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }

  showSuccess(message: string) {
    Swal.fire(message, '', 'success')
  }

  showError(message: string) {
    Swal.fire(message, '', 'error')
  }

  onAlertUpdate(){
    $(function () {
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        icon: 'success',
        title: 'แก้ไขสำเร็จ'
      });
    });
  }
}
