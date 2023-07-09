import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Inventory} from '../../../../../entities/inventory';
import {MatDialog} from '@angular/material/dialog';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Salepayment} from '../../../../../entities/salepayment';

@Component({
  selector: 'app-sale-payment-sub-form',
  templateUrl: './sale-payment-sub-form.component.html',
  styleUrls: ['./sale-payment-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalePaymentSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SalePaymentSubFormComponent),
      multi: true,
    }
  ]
})
export class SalePaymentSubFormComponent extends AbstractSubFormComponent<Salepayment> {



  constructor(protected dialog: MatDialog) {
    super();
  }

  // Form related variables and functions

  fieldValidations = {
    pamount: [],
  };

  form = new FormGroup({
    id: new FormControl(null),
    pamount: new FormControl('', this.fieldValidations.pamount),
  });
  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }


  get pamountField(): FormControl{
    return this.form.controls.pamount as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.pamountField);
  }

  setValidations(): void{
    this.fieldValidations.pamount = [ Validators.required ];
  }

  removeValidations(): void{
    this.fieldValidations.pamount = [];
  }

  fillForm(dataItem: Salepayment): void {
    this.idField.patchValue(dataItem.id);
    this.pamountField.patchValue(dataItem.pamount);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }



  // Operations related functions

  getDeleteConfirmMessage(dataItem: Salepayment): string {
    return `Are you sure to remove \u201C ${dataItem.pamount} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Salepayment): string {
    if (this.isFormEmpty){
      return `Are you sure to update \u201C\u00A0${dataItem.pamount}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.pamount}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Salepayment = new Salepayment();
    dataItem.id = this.idField.value;
    dataItem.pamount = this.pamountField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }


}
