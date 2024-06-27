import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-register-new',
  templateUrl: './register-new.component.html',
  styleUrls: ['./register-new.component.css']
})
export class RegisterNewComponent implements OnInit, OnDestroy {

  @ViewChild('myBar') myBar!: ElementRef;
  @ViewChild('lbBar') lbBar!: ElementRef;
  @ViewChild('readingTime') readingTime!: ElementRef;
  @ViewChild('photo') photo!: ElementRef;
  @ViewChild('socketMessage') socketMessage!: ElementRef;

  @ViewChild('physicalAddress') physicalAddress!: ElementRef;
  @ViewChild('firstNameT') firstNameT!: ElementRef;

  @ViewChild('lastNameT') lastNameT!: ElementRef;


  @ViewChild('gender') gender!: ElementRef;
  @ViewChild('birthDate') birthDate!: ElementRef;
  @ViewChild('nidNum') nidNum!: ElementRef;
  @ViewChild('address') address!: ElementRef;


  @ViewChild('readerNameStatus') readerNameStatus!: ElementRef;
  @ViewChild('ledCardStatus') ledCardStatus!: ElementRef;
  @ViewChild('cardStatus') cardStatus!: ElementRef;
  @ViewChild('chkAutoRead') chkAutoRead!: ElementRef;
  @ViewChild('chkAutoNIDNumber') chkAutoNIDNumber!: ElementRef;
  @ViewChild('chkAutoNIDText') chkAutoNIDText!: ElementRef;
  @ViewChild('chkAutoAText') chkAutoAText!: ElementRef;
  @ViewChild('chkAutoNIDPhoto') chkAutoNIDPhoto!: ElementRef;
  @ViewChild('chkNIDNumber') chkNIDNumber!: ElementRef;
  @ViewChild('chkNIDText') chkNIDText!: ElementRef;
  @ViewChild('chkAText') chkAText!: ElementRef;
  @ViewChild('chkNIDPhoto') chkNIDPhoto!: ElementRef;
  @ViewChild('listReadername') listReadername!: ElementRef;
  @ViewChild('btngetreaderlist') btngetreaderlist!: ElementRef;

  //not show
  readerSelected!: string;   // ชื่อเครื่องอ่าบัตร
  titleFlag!: string;        // คำนำหน้า
  cardType!: string;         // ประเภทบัตร
  structureVersion!: string   // เวอร์ชั่น
  bp1RequestNumber!: string  // หมายเลขคำขอ
  issuerCode!: string        // รหัสผู้ออกบัตร
  issueDate!: string;     // วันออกบัตร
  expireDate!: string   // วันหมดอายุ
  issueNum!: string    // หมายเลขออกบัตร
  placeOfIssue!: string // สถานที่ออกบัตร
  middleNameT!: string; // ชื่อกลางไทย
  middleNameE!: string; // ชื่อกลางอังกฤษ
  firstNameE!: string;  // ชื่ออังกฤษ
  lastNameE!: string;  // นามสกุลอังกฤษ

  private intendPresent_flag = true;
  private debugFlag = true;
  private readingTimeMs = 0;
  private then: Date | null = null;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit() {
    this.websocketService.connect("ws://localhost:14820/TDKWAgent");
    this.websocketService.messages$.subscribe(message => this.onGetMessage(message));
  }

  ngOnDestroy() {
    this.websocketService.closeConnection();
  }

  wSocketSend(jsonStr: string) {
    this.websocketService.sendMessage(jsonStr);
  }

  getAutoReadOptions() {
    const JS_OBJ = { Command: "GetAutoReadOptions" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  setAutoReadOptions() {
    const cmdNIDAutoRead = this.chkAutoRead.nativeElement.checked;
    const cmdIDNumber = this.chkAutoNIDNumber.nativeElement.checked;
    const cmdText = this.chkAutoNIDText.nativeElement.checked;
    const cmdATaxt = this.chkAutoAText.nativeElement.checked;
    const cmdphoto = this.chkAutoNIDPhoto.nativeElement.checked;
    this.disabledButton(cmdNIDAutoRead);

    const JS_OBJ = {
      Command: "SetAutoReadOptions",
      AutoRead: cmdNIDAutoRead,
      IDNumberRead: cmdIDNumber,
      IDTextRead: cmdText,
      IDATextRead: cmdATaxt,
      IDPhotoRead: cmdphoto
    };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  getReaderlist() {
    // this.readerSelected.nativeElement.innerHTML = "";
    // this.readerSelected.nativeElement.style.color = "black";
    this.readerSelected = "";
    const JS_OBJ = { Command: "GetReaderList" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  selectReader() {
    const e = this.listReadername.nativeElement as HTMLSelectElement;
    let readername = e.options[e.selectedIndex].text;
    if (readername == "Reader not found") {
      readername = "";
    }
    const JS_OBJ = { Command: "SelectReader", ReaderName: readername };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  readNIDCard() {
    this.clearScreen();
    this.selectReader();
    const cmdIDNumber = this.chkNIDNumber.nativeElement.checked;
    const cmdText = this.chkNIDText.nativeElement.checked;
    const cmdAText = this.chkAText.nativeElement.checked;
    const cmdphoto = this.chkNIDPhoto.nativeElement.checked;

    const JS_OBJ = {
      Command: "ReadIDCard",
      IDNumberRead: cmdIDNumber,
      IDTextRead: cmdText,
      IDATextRead: cmdAText,
      IDPhotoRead: cmdphoto
    };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
    this.resetTimer();
    this.startTimer();
  }

  getSoftwareInfo() {
    const JS_OBJ = { Command: "GetSoftwareInfo" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  getLicenseInfo() {
    const JS_OBJ = { Command: "GetLicenseInfo" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  getReaderID() {
    const JS_OBJ = { Command: "GetReaderID" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  updateLicenseFile() {
    const JS_OBJ = { Command: "UpdateLicenseFile" };
    const jsonStr = JSON.stringify(JS_OBJ);
    this.wSocketSend(jsonStr);
  }

  startTimer() {
    this.then = new Date();
    this.then.setTime(this.then.getTime() - this.readingTimeMs);
  }

  stopTimer() {
    const now = new Date();
    this.readingTimeMs = now.getTime() - this.then!.getTime();
    this.readingTime.nativeElement.style.display = "inherit";
    this.readingTime.nativeElement.innerHTML = "Reading Time: " + this.msToSecond(this.readingTimeMs) + " s";
  }

  resetTimer() {
    this.readingTimeMs = 0;
    this.readingTime.nativeElement.innerHTML = "Reading Time: " + this.msToSecond(this.readingTimeMs) + " s";
    this.readingTime.nativeElement.style.display = "none";
  }

  msToSecond(duration: number): string {
    const milliseconds = parseInt((duration % 1000).toString().padStart(3, '0'));
    const seconds = Math.floor(duration / 1000);
    return seconds + "." + milliseconds;
  }

  add_slash(Date: string): string {
    const date = Date.substring(6, 8);
    const month = Date.substring(4, 6);
    const year = Date.substring(0, 4);
    return date + "/" + month + "/" + year;
  }

  putToScreen(jsObj: any) {
    const IDNum = jsObj.ID_Number;
    const IDText = jsObj.ID_Text;
    const IDAText = jsObj.ID_AText;
    const IDPhoto = jsObj.ID_Photo;
    const status = jsObj.Status;

    if (status == 0) {
      if (IDNum != "") {
        this.nidNum.nativeElement.value = IDNum;
      }

      if (IDText != "") {
        const NIDData = IDText.split("#");

        this.issueNum = NIDData[22];
        this.nidNum.nativeElement.value = NIDData[0];
        this.firstNameT.nativeElement.value = NIDData[1] + " " + NIDData[2];
        this.middleNameT = NIDData[3];
        this.lastNameT.nativeElement.value = NIDData[4];
        this.firstNameE = NIDData[5] + " " + NIDData[6];
        this.middleNameE = NIDData[7];
        this.lastNameE = NIDData[8];
        if (NIDData[17] == "1") this.gender.nativeElement.value = "Male";
        else if (NIDData[17] == "2") this.gender.nativeElement.value = "Female";
        else this.gender.nativeElement.value = NIDData[17];
        this.birthDate.nativeElement.value = this.add_slash(NIDData[18]);
        this.address.nativeElement.value = `${NIDData[9]} ${NIDData[10]} ${NIDData[11]} ${NIDData[12]} ${NIDData[13]}\r\n${NIDData[14]} ${NIDData[15]} ${NIDData[16]}`;
        this.issueDate = this.add_slash(NIDData[20]);
        this.expireDate = this.add_slash(NIDData[21]);
        this.placeOfIssue = NIDData[19];
      }

      if (IDAText != "") {
        const NIDData = IDAText.split("#");

        this.issueNum = NIDData[22];
        this.nidNum.nativeElement.value = NIDData[0];
        this.firstNameT.nativeElement.value = NIDData[1] + " " + NIDData[2];
        this.middleNameT = NIDData[3];
        this.lastNameT.nativeElement.value = NIDData[4];
        this.firstNameE = NIDData[5] + " " + NIDData[6];
        this.middleNameE = NIDData[7];
        this.lastNameE = NIDData[8];
        if (NIDData[17] == "1") this.gender.nativeElement.value = "Male";
        else if (NIDData[17] == "2") this.gender.nativeElement.value = "Female";
        else this.gender.nativeElement.value = NIDData[17];
        this.birthDate.nativeElement.value = this.add_slash(NIDData[18]);
        this.address.nativeElement.value = `${NIDData[9]} ${NIDData[10]} ${NIDData[11]} ${NIDData[12]} ${NIDData[13]}\r\n${NIDData[14]} ${NIDData[15]} ${NIDData[16]}`;
        this.issueDate = this.add_slash(NIDData[20]);
        this.expireDate = this.add_slash(NIDData[21]);
        this.placeOfIssue = NIDData[19];

        if (NIDData.length > 23) {
          this.bp1RequestNumber = NIDData[23];
          this.issuerCode = NIDData[24];
          this.structureVersion = NIDData[25];
          this.cardType = NIDData[26];

          let txt_titleFlag = "";
          switch (NIDData[27]) {
            case " ":
              txt_titleFlag = "ไม่มีข้อมูล";
              break;
            case "0":
              txt_titleFlag = "0: ปกติ";
              break;
            case "1":
              txt_titleFlag = "1: ยศทหารเรือ (ร.น.)";
              break;
            case "2":
              txt_titleFlag = "2: สมณศักดิ์";
              break;
            default:
              txt_titleFlag = NIDData[27];
          }

          // this.titleFlag.nativeElement.value = txt_titleFlag;
          this.titleFlag = txt_titleFlag;
        }
      }

      if (IDPhoto != null) {
        this.photo.nativeElement.setAttribute("src", "data:image/png;base64," + IDPhoto);
      } else {
        this.photo.nativeElement.src = "assets/images/PNIDCard.JPG";
      }
      if (this.debugFlag) {
        console.log("Reading is finished");
      }
    } else {
      if (this.debugFlag) {
        console.log("Read error");
      }
      alert("ERROR Code :" + status);
    }
  }

  clearScreen() {
    this.nidNum.nativeElement.value = "";
    this.firstNameT.nativeElement.value = "";
    this.middleNameT = "";
    this.lastNameT.nativeElement.value = "";
    this.firstNameE = "";
    this.middleNameE = "";
    this.lastNameE = "";
    this.birthDate.nativeElement.value = "";
    this.gender.nativeElement.value = "";
    this.address.nativeElement.value = "";
    this.issueDate = "";
    this.expireDate = "";
    this.issueNum = "";
    this.placeOfIssue = "";
    this.bp1RequestNumber = "";
    this.issuerCode = "";
    this.structureVersion = "";
    this.cardType = "";
    this.titleFlag = "";
    this.photo.nativeElement.src = "assets/images/PNIDCard.JPG";
    this.myBar.nativeElement.style.width = "0%";
    this.lbBar.nativeElement.innerHTML = "0%";
    this.readingTime.nativeElement.innerHTML = "";
  }

  disabledButton(disabled: boolean) {
    this.chkAutoNIDNumber.nativeElement.disabled = !disabled;
    this.chkAutoAText.nativeElement.disabled = !disabled;
    this.chkAutoNIDText.nativeElement.disabled = !disabled;
    this.chkAutoNIDPhoto.nativeElement.disabled = !disabled;
  }

  disableReadbtn(disabled: boolean) {
    this.chkNIDNumber.nativeElement.disabled = disabled;
    this.chkAText.nativeElement.disabled = disabled;
    this.chkNIDText.nativeElement.disabled = disabled;
    this.chkNIDPhoto.nativeElement.disabled = disabled;

    this.btngetreaderlist.nativeElement.disabled = disabled;
    this.listReadername.nativeElement.disabled = disabled;
    // this.btnreadData.nativeElement.disabled = disabled;
  }

  onGetMessage(jsonString: string) {
    const msgObj = JSON.parse(jsonString);

    if (
      msgObj.Message != "ReadingProgressE" &&
      msgObj.Message != "CardStatusChangeE"
    ) {
      if (this.debugFlag) {
        console.log("<" + msgObj.Message + "(" + msgObj.Status + ")");
      }
    }
    if (msgObj.Message == "AgentStatusE") {
      if (msgObj.Status == 1) {
        this.setAutoReadOptions();
        this.getReaderlist();
        this.socketMessage.nativeElement.innerHTML = "Agent: " + msgObj.AgentInfo;
        this.socketMessage.nativeElement.style.color = "blue";
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "CardStatusChangeE") {
      if (this.debugFlag) {
        console.log(
          "<CardStatusChangeE: " +
          "(" +
          msgObj.Status +
          ")" +
          " ReaderName: " +
          "(" +
          msgObj.ReaderName +
          ")"
        );
      }

      if (msgObj.Status == -1004) {
        alert("ERROR Code :" + msgObj.Status);
        return;
      } else if (msgObj.Status == 1) {
        this.resetTimer();
        this.startTimer();
        this.clearScreen();

        this.intendPresent_flag = false;
        this.readerNameStatus.nativeElement.style.color = "limegreen";
        this.readerNameStatus.nativeElement.innerHTML = msgObj.ReaderName;

        this.cardStatus.nativeElement.style.color = "limegreen";
        this.cardStatus.nativeElement.innerHTML = "Card Status: Present";
        this.ledCardStatus.nativeElement.style.backgroundColor = "limegreen";
      } else if (msgObj.Status == -16) {
        this.intendPresent_flag = true;
        this.readerNameStatus.nativeElement.style.color = "red";
        this.readerNameStatus.nativeElement.innerHTML = msgObj

        //-------
        this.cardStatus.nativeElement.style.color = "red";
        this.cardStatus.nativeElement.innerHTML = "Card Status: Absent";
        this.ledCardStatus.nativeElement.style.backgroundColor = "red";
      } else if (msgObj.Status == 0) {
        this.cardStatus.nativeElement.style.color = "orange";
        this.cardStatus.nativeElement.innerHTML = "Card Status: Unknown";
        this.ledCardStatus.nativeElement.style.backgroundColor = "orange";

        this.readerNameStatus.nativeElement.style.color = "orange";
        this.readerNameStatus.nativeElement.innerHTML = msgObj.ReaderName;
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
      msgObj.ReaderName = "";
    }

    if (msgObj.Message == "ReadingProgressE") {
      if (msgObj.Status == 0) {
        this.myBar.nativeElement.style.backgroundColor = 'rgb(10, 206, 241)';
        this.myBar.nativeElement.style.width = msgObj.Progress + "%";
        this.lbBar.nativeElement.innerHTML = msgObj.Progress + "%";
        if (this.debugFlag) {
          console.log("<ReadingProgressE" + "(" + msgObj.Status + "): " + msgObj.Progress + "%");
        }
      }
      if (msgObj.Status == -1) {
        this.myBar.nativeElement.style.backgroundColor = "red";
      }
    }

    if (msgObj.Message == "AutoReadIDCardE") {
      this.stopTimer();
      this.putToScreen(msgObj);
    }

    if (msgObj.Message == "AutoSelectReaderE") {
      // this.readerSelected.nativeElement.style.color = "limegreen";
      // this.readerSelected.nativeElement.innerHTML = msgObj.ReaderName;
    }

    if (msgObj.Message == "GetReaderListR") {
      const readerData = msgObj.ReaderList;
      const readerList = this.listReadername.nativeElement as HTMLSelectElement;
      if (msgObj.Status > 0) {
        while (readerList.options.length) {
          readerList.remove(0);
        }
        readerData.forEach((reader: string, index: number) => {
          const txtReaderName = new Option(reader, index.toString());
          readerList.options.add(txtReaderName);
        });
      } else {
        if (msgObj.Status == -3 || msgObj.Status == 0) {
          while (readerList.options.length) {
            readerList.remove(0);
          }
          const txtReaderName = new Option("Reader not found", "0");
          readerList.options.add(txtReaderName);
        } else {
          alert("ERROR Code :" + msgObj.Status);
        }
      }
    }

    if (msgObj.Message == "SelectReaderR") {
      const strReader = msgObj.ReaderName;
      if (parseInt(msgObj.Status) > 0) {
        // this.readerSelected.nativeElement.innerHTML = strReader;
        // this.readerSelected.nativeElement.style.color = "green";
      } else {
        if (strReader == "") {
          let strReader = "Reader";
        }
        // this.readerSelected.nativeElement.innerHTML = strReader + ": Not selected";
        // this.readerSelected.nativeElement.style.color = "red";
        const readerList = this.listReadername.nativeElement as HTMLSelectElement;
        if (msgObj.Status == -3) {
          while (readerList.options.length) {
            readerList.remove(0);
          }
          const txtReaderName = new Option("Reader not found", "0");
          readerList.options.add(txtReaderName);
        }
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "ReadIDCardR") {
      this.stopTimer();
      this.putToScreen(msgObj);
    }

    if (msgObj.Message == "GetSoftwareInfoR") {
      if (msgObj.Status == 0) {
        const StrResult = msgObj.SoftwareInfo.split("#");
        let txtResult = "";
        StrResult.forEach((result: string) => {
          txtResult += result + "\r\n";
        });
        alert(txtResult);
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "GetLicenseInfoR") {
      if (msgObj.Status == 0) {
        alert(msgObj.LicenseInfo);
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "GetReaderIDR") {
      if (msgObj.Status > 0) {
        alert("Reader ID: " + msgObj.ReaderID);
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "UpdateLicenseFileR") {
      if (msgObj.Status >= 0 && msgObj.Status < 4) {
        alert("The new license file has been successfully updated. (" + msgObj.Status + ")");
      } else if (msgObj.Status >= 100 && msgObj.Status < 104) {
        alert("The latest license file has already been installed. (" + msgObj.Status + ")");
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "GetAutoReadOptionsR") {
      if (msgObj.Status == 0) {
        this.chkAutoRead.nativeElement.checked = msgObj.AutoRead;
        this.chkAutoNIDNumber.nativeElement.checked = msgObj.IDNumberRead;
        this.chkAutoNIDText.nativeElement.checked = msgObj.IDTextRead;
        this.chkAutoAText.nativeElement.checked = msgObj.IDATextRead;
        this.chkAutoNIDPhoto.nativeElement.checked = msgObj.IDPhotoRead;
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }

    if (msgObj.Message == "SetAutoReadOptionsR") {
      if (msgObj.Status == 0) {
        this.chkAutoRead.nativeElement.checked = msgObj.AutoRead;
        this.chkAutoNIDNumber.nativeElement.checked = msgObj.IDNumberRead;
        this.chkAutoNIDText.nativeElement.checked = msgObj.IDTextRead;
        this.chkAutoAText.nativeElement.checked = msgObj.IDATextRead;
        this.chkAutoNIDPhoto.nativeElement.checked = msgObj.IDPhotoRead;
      } else {
        alert("ERROR Code :" + msgObj.Status);
      }
    }
  }
}
