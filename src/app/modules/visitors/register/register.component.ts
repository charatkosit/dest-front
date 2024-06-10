import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoReadIDCard, ExtractData } from 'src/app/interfaces/IDCardData';
import { VisitorService } from 'src/app/services/visitor.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit , AfterViewInit , OnDestroy{

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  private mediaStream!: MediaStream;

  videoWidth = 0;
  videoHeight = 0;

  capturedButton = 0;

  user = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    idCard: '',
    token: '',
    destFloor: ''

  };

  idCardData!: ExtractData;

  constructor(
    private http: HttpClient,
    private webSocket: WebsocketService,
    private visitor: VisitorService
  ) { }


  autoReadData$!: Observable<AutoReadIDCard | null>;

  ngAfterViewInit(): void {
    this.startCamera();
  }

  ngOnInit(): void {
    this.onAlert_AutoGetIDCard()

    this.autoReadData$ = this.webSocket.getAutoReadData();
    console.log(`this.autoReadData$`, this.autoReadData$)
    this.autoReadData$.subscribe((data) => {
      // console.log(`data`, data)

      const { Message, ID_Number, ID_Text, ID_Photo } = data!;

      // Split the data by '#'
      const splitData = ID_Text.split('#');
      if (splitData[17] === '1') { splitData[17] = 'ชาย'; }
      if (splitData[17] === '2') { splitData[17] = 'หญิง'; }

      // Assign the data to the interface
      this.idCardData = {
        idCard: splitData[0],
        title: splitData[1],
        firstName: splitData[2],
        middleName: splitData[3],
        lastName: splitData[4],
        titleEn: splitData[5],
        firstNameEn: splitData[6],
        middleNameEn: splitData[7],
        lastNameEn: splitData[8],
        address: `${splitData[9]} ${splitData[10]} ${splitData[11]} ${splitData[12]} ${splitData[13]} ${splitData[14]} ${splitData[15]} ${splitData[16]}`,
        key11: splitData[10],   //addeess2
        key12: splitData[11],   //addeess3
        key13: splitData[12],   //addeess4
        street: splitData[13],
        tambol: splitData[14],
        amphur: splitData[15],
        province: splitData[16],
        gender: splitData[17],
        birthday: this.visitor.formatDateString(splitData[18]),
        issuePlace: splitData[19],
        issueDate: this.visitor.formatDateString(splitData[20]),
        expireDate: this.visitor.formatDateString(splitData[21]),
        IDPhotoNum: splitData[22],
      }
      this.capturedButton = 0;
      // Output the result
      console.log(`this.idCardData`, this.idCardData);
    })

  }


 
  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      });
    }
  }

  capture() {
    this.videoWidth = this.videoElement.nativeElement.videoWidth;
    this.videoHeight = this.videoElement.nativeElement.videoHeight;

    let context = this.canvasElement.nativeElement.getContext('2d');
    this.canvasElement.nativeElement.width = this.videoWidth;
    this.canvasElement.nativeElement.height = this.videoHeight;
    context.drawImage(this.videoElement.nativeElement, 0, 0, this.videoWidth, this.videoHeight);

    this.saveImage();
    this.capturedButton++ ;
  }

  saveImage() {
    const dataUrl = this.canvasElement.nativeElement.toDataURL('image/png');

    // Get the current date and time
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const fileName = `webcam-${this.idCardData.idCard}-${dateStr}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
    
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  onAlert_AutoGetIDCard() {
    Swal.fire({
      title: "ใช้บัตรประชาชนลงทะเบียน",
      text: "กรุณา เสียบบัตรประชาชน",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง"
    })
    // .then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire({
    //       title: "ดึงข้อมูลจากบัตรประชาชน",
    //       text: "กรุณา เลือกชั้นที่ติดต่องาน",
    //       icon: "success"
    //     });
    //   }
    // });
  }



  onSubmit() {
    // ทำการส่งข้อมูล
    const url = '/api/visitors'
    this.http.post(url, this.user).subscribe({
      next: response => {
        console.log(response);
        this.resetForm();
      },
      error: error => {
        console.error(error);
      }
    }

    );
  }




  resetForm() {
    this.user = {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      idCard: '',
      token: '',
      destFloor: ''
    };
  }


}
