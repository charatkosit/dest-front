export interface InitCommand {
    Command: string;
    ReaderName: string;
  }
  
export  interface SelectReaderResponse {
    Message: string;
    ReaderName: string;
    Status: number;
  }
  
export  interface AutoReadIDCard {
    Message: string;
    ID_Number: string;
    ID_Text: string;
    ID_AText: string;
    ID_Photo: string;
    Status: number;
  }
export interface ExtractData {
    idCard: string;  // ID_Text. IDCart Number
    title: string;  // ID_Text. th_title
    firstName: string;  // ID_Text. th_FirstName
    middleName: string;  // ID_Text. th_MiddleName
    lastName: string;  // ID_Text. th_LastName
    titleEn: string;  // ID_Text. en_title
    firstNameEn: string;  // ID_Text. en_FirstName
    middleNameEn: string;  // ID_Text. en_MiddleName
    lastNameEn: string;  // ID_Text. en_LastName
    address: string; // ID_Text. address1   house number
    key11: string; // ID_Text. address2
    key12: string; // ID_Text. address3
    key13: string; // ID_Text. address4
    street: string; // ID_Text, address5
    tambol: string; // ID_Text. address6   tambon
    amphur: string; // ID_Text. address7   amphur
    province: string; // ID_Text. address8   province
    gender: string; // ID_Text. Gender     1 = ชาย, 2 = หญิง
    birthday: string; // ID_Text. BirthDate  yyyyMMdd พ.ศ.
    issuePlace: string; // ID_Text. IssuePlace
    issueDate: string; // ID_Text. IssueDate  yyyyMMdd พ.ศ.
    expireDate: string; // ID_Text. ExpireDate yyyyMMdd พ.ศ.
    IDPhotoNum: string; // ID_Text. ID_Photo number
}