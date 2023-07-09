import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Purchaseitem} from '../../../../../entities/purchaseitem';
import {Item} from '../../../../../entities/item';
import {MatDialog} from '@angular/material/dialog';
import {Porderitem} from '../../../../../entities/porderitem';
import {DateHelper} from '../../../../../shared/date-helper';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-purchase-item-sub-form',
  templateUrl: './purchase-item-sub-form.component.html',
  styleUrls: ['./purchase-item-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PurchaseItemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PurchaseItemSubFormComponent),
      multi: true,
    }
  ]
})
export class PurchaseItemSubFormComponent extends AbstractSubFormComponent <Purchaseitem> {

  @Input()
  items: Item[] = [];


  constructor(protected dialog: MatDialog, private snackBar: MatSnackBar) {
    super();
  }

  // Form related variables and functions

  fieldValidations = {
    qty: [],
    item: [],
    unitprice: [],
    doexpired: [],
    domanufactured: [],
    batchno: []
  };

  form = new FormGroup({
    id: new FormControl(null),
    qty: new FormControl('', this.fieldValidations.qty),
    item: new FormControl('', this.fieldValidations.item),
    unitprice: new FormControl('', this.fieldValidations.unitprice),
    batchno: new FormControl('', this.fieldValidations.batchno),
    domanufactured: new FormControl('', this.fieldValidations.domanufactured),
    doexpired: new FormControl('', this.fieldValidations.doexpired),



  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
  }
  get doexpiredField(): FormControl{
    return this.form.controls.doexpired as FormControl;
  }
  get domanufacturedField(): FormControl{
    return this.form.controls.domanufactured as FormControl;
  }
  get batchnoField(): FormControl{
    return this.form.controls.batchno as FormControl;
  }
  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.itemField)
  &&   this.isEmptyField(this.unitpriceField)
  &&   this.isEmptyField(this.doexpiredField)
  &&   this.isEmptyField(this.domanufacturedField)
  &&   this.isEmptyField(this.batchnoField);
  }

  setValidations(): void{
    this.fieldValidations.qty = [ Validators.required ];
    this.fieldValidations.item = [ Validators.required ];
    this.fieldValidations.unitprice = [ Validators.required ];
    this.fieldValidations.batchno = [ Validators.required ];
    // this.fieldValidations.domanufactured = [ Validators.required ];
    // this.fieldValidations.doexpired = [ Validators.required ];


  }

  removeValidations(): void{
    this.fieldValidations.qty = [];
    this.fieldValidations.item = [];
    this.fieldValidations.unitprice = [];
    this.fieldValidations.batchno = [];
    this.fieldValidations.domanufactured = [];
    this.fieldValidations.doexpired = [];
  }

  fillForm(dataItem: Purchaseitem): void {
    this.idField.patchValue(dataItem.id);
    this.qtyField.patchValue(dataItem.qty);

    for (const item of this.items){
      if (JSON.stringify(dataItem.item) === JSON.stringify(item)){
        this.itemField.patchValue(item);
      }
    }

    this.unitpriceField.patchValue(dataItem.unitprice);
    this.batchnoField.patchValue(dataItem.batchno);
    this.domanufacturedField.patchValue(dataItem.domanufactured);
    this.doexpiredField.patchValue(dataItem.doexpired);

  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }



  // Operations related functions

  getDeleteConfirmMessage(dataItem: Porderitem): string {
    return `Are you sure to remove \u201C ${dataItem.item.name} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Porderitem): string {
    if (this.isFormEmpty){
      return `Are you sure to update \u201C\u00A0${dataItem.item.name}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.item.name}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void{
    if (this.form.invalid) { return; }

    for (const existingItem of this.dataList){
      if (existingItem.item.id === this.itemField.value){
        this.snackBar.open('Selected item is already exist', null, {duration: 2000});
        return;
      }
    }

    const dataItem: Purchaseitem = new Purchaseitem();
    dataItem.id = this.idField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.item = this.itemField.value;
    dataItem.batchno = this.batchnoField.value;
    dataItem.domanufactured = DateHelper.getDateAsString(this.domanufacturedField.value);
    dataItem.doexpired = DateHelper.getDateAsString(this.doexpiredField.value);
    dataItem.unitprice = this.unitpriceField.value;


    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }

}
