import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  @ViewChild('invFileUploadElem') invFileUploadElemRef;
  public invGridRowData: any[];
  public invShowAddLineItemDialog: boolean = false;
  public invAddLineItemData: any = {};
  public invFileUploadUrl: SafeHtml;
  public invForm: FormGroup;
  public invShowDetailDialog: boolean = false;
  public invDetail: any = {};
  public invSubTotal: any;

  constructor(private domSanitizerRef: DomSanitizer,
              private formBuilderRef: FormBuilder) {
  }

  //Call From ngOnInit()
  invFormInit() {
    this.invForm = this.formBuilderRef.group({
      invoice_address: '618 Cody Ridge Road',
      bill_to_address: '1175  Benson Street',
      invoice_id: '40014521',
      date: [{value: new Date().toLocaleDateString(), disabled: true}],
      payment_terms: '5',
      //86400000 = 24hrs * 60mins * 60sec * 1000ms
      due_date: [{value: new Date(new Date().getTime() + 86400000).toLocaleDateString(), disabled: true}],
      balance_due: '15000'
    });
  }

  //Call From <p-table> - onEditComplete, onEditInit Emitter
  invGridRowUpdate() {
    this.invSubTotal = 0;
    //Update Amount Column
    this.invGridRowData.map((rData) => {
      let total: any = rData.quantity * rData.rate;
      total = isNaN(total) ? '' : total;
      rData.amount = total;
      this.invSubTotal += total;
      return rData;
    });
  }

  //'+ Line Item' Button Click
  invAddLineItem() {
    this.invShowAddLineItemDialog = true;
    this.invAddLineItemData = {};
  }

  //Add Line Item Modal On Save
  invAddLineItemOnSave() {
    let oData, amount;
    oData = this.invAddLineItemData;
    amount = oData.quantity * oData.rate;
    amount = isNaN(amount) ? '' : amount;
    this.invSubTotal = this.invSubTotal + amount;
    this.invShowAddLineItemDialog = false;
    this.invGridRowData.push({
      item: oData.item,
      quantity: oData.quantity,
      rate: oData.rate,
      amount: amount
    });
  }

  //Logo Image - Browse File Selection
  invFileUploadSelect() {
    let fileArray = this.invFileUploadElemRef.files;
    let fileUnSafeBlobUrl = (fileArray && fileArray.length) ? fileArray[0]['objectURL']['changingThisBreaksApplicationSecurity'] : '';
    //Sanitizing values to be safe [DomSanitizer]
    this.invFileUploadUrl = this.domSanitizerRef.bypassSecurityTrustResourceUrl(fileUnSafeBlobUrl);
    this.invFileUploadElemRef.clear();
  }

  //Send Invoice Button On Click
  invOnSend() {
    this.invShowDetailDialog = true;
    this.invDetail.formData = this.invForm.getRawValue();
    this.invDetail.logo_blob_url = this.invFileUploadUrl;
    this.invDetail.grid_data = this.invGridRowData;
    this.invDetail.item_sub_total = this.invSubTotal;
  }

  ngOnInit() {
    this.invGridRowData = [{item: "Item A", quantity: 2, rate: 3, amount: 6}];
    this.invSubTotal = this.invGridRowData[0]['amount'];
    this.invFormInit();
  }
}
