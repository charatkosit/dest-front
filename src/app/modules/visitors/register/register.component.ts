import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid'
import { Observable, Subscription } from 'rxjs';
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
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('video', { static: true }) video!: ElementRef;

  private stream!: MediaStream;

  videoWidth!: number;
  videoHeight!: number;
  private capturedImage!: string;
  capturedButton = 0;

  guest = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    idCard: '',
    token: '',
    destFloor: ''


  };

  idCardData!: ExtractData;

  visitorForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private webSocket: WebsocketService,
    private visitor: VisitorService
  ) {
    this.visitorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      idCard: ['',Validators.required],
      token: ['', Validators.required],
      destFloor: ['', Validators.required]

    });
  }


  autoReadData$!: Observable<AutoReadIDCard | null>;


  ngAfterViewInit(): void {
    // this.startCamera();
  }

  ngOnInit(): void {
  }

  
  ngOnDestroy(): void {
    this.stopCamera();
    this.stopSmartCard();
  }

  startSmartCard() {
    this.autoReadData$ = this.webSocket.getAutoReadData();
    console.log(`this.autoReadData$`, this.autoReadData$)
    this.autoReadData$.subscribe((data) => {
      console.log(`data`, data)

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

      //ถ้ามีข้อมูลให้นำข้อมูลไปแสดงบนฟอร์ม
      if(this.idCardData){
        this.setDataToForm(this.idCardData)
      }
    })

  }

setDataToForm(idCardData: ExtractData){
  this.visitorForm.patchValue({
    firstName: this.idCardData.firstName,
    lastName: this.idCardData.lastName,
    phone: '',
    idCard: this.idCardData.idCard,
    token: '',
    destFloor: ''
  });
}

  startCamera() {
    console.log('startCamera');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.stream = stream;
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      });
    }
  }

  capture() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext('2d');
    if (context) { // add this null check
      context.drawImage(this.video.nativeElement, 0, 0, 640, 480);
      this.capturedImage = canvas.toDataURL('image/png');
      //เซพรูป
      this.saveImage();
    } else {
      console.error('Unable to get 2D context from canvas');
    }
  }

  saveImage() {
    if (this.capturedImage) {
      const uniqueFilename = `img-${uuidv4()}.png`;

      const link = document.createElement('a');
      link.href = this.capturedImage;
      link.download = uniqueFilename;
      link.click();
    } else {
      alert('No image captured!');
    }
  }


  stopCamera() {
    console.log('stopCamera');
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }


  stopSmartCard() {
    // if(this.autoReadData$){
    //   this.autoReadData$.unsubscribe();
    // }
    this.webSocket.close();

  }


  onWebCamSwitchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.startCamera();
    } else {
      this.stopCamera();
    }
  }

  onSmartCardSwitchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.startSmartCard();
    } else {
      // this.stopCamera();
    }
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

    console.log(`this.visitorForm`, this.visitorForm.value);
    // ทำการส่งข้อมูล

    const uri = '/api/visitors'
    const data = this.visitorForm.value;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (this.visitorForm.valid) {
      this.http.post(uri, data, { headers }).subscribe({
        next: response => {
          console.log(response);
          this.resetForm();
        },
        error: error => {
          console.error(error);
        }
      });
    }

    //
    this.router.navigate(['/visitors/visitor-list']);

  }


  isInvalid(controlName: string): boolean {
    const control = this.visitorForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched) || false;
  }

  resetForm() {
    this.guest = {
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
