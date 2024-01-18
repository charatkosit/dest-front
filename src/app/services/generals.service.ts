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



  onAlert() {
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
}
