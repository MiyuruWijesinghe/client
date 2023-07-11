import {Component, forwardRef, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Inventorycustomertype} from '../../../../../entities/inventorycustomertype';
import {Customertype} from '../../../../../entities/customertype';

@Component({
  selector: 'app-inventory-customertype-sub-form',
  templateUrl: './inventory-customertype-sub-form.component.html',
  styleUrls: ['./inventory-customertype-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InventoryCustomertypeSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InventoryCustomertypeSubFormComponent),
      multi: true,
    }
  ]
})
export class InventoryCustomertypeSubFormComponent extends AbstractSubFormComponent <Inventorycustomertype> {
  @Input()
  customertypes: Customertype[] = [];
  fieldValidations = {
    price: [],
    customertype: [],
  };

  // Form related variables and functions
  form = new FormGroup({
    id: new FormControl(null),
    price: new FormControl('', this.fieldValidations.price),
    customertype: new FormControl('', this.fieldValidations.customertype),
  });

  constructor(protected dialog: MatDialog) {
    super();
  }

  get idField(): FormControl {
    return this.form.controls.id as FormControl;
  }

  get priceField(): FormControl {
    return this.form.controls.price as FormControl;
  }

  get customertypeField(): FormControl {
    return this.form.controls.customertype as FormControl;
  }

  get isFormEmpty(): boolean {
    return this.isEmptyField(this.idField)
      && this.isEmptyField(this.priceField)
      && this.isEmptyField(this.customertypeField);
  }

  setValidations(): void {
    this.fieldValidations.price = [Validators.required];
    this.fieldValidations.customertype = [Validators.required];
  }

  removeValidations(): void {
    this.fieldValidations.price = [];
    this.fieldValidations.customertype = [];
  }

  fillForm(dataItem: Inventorycustomertype): void {
    this.idField.patchValue(dataItem.id);
    this.priceField.patchValue(dataItem.price);
    this.customertypeField.patchValue(dataItem.customertype);
  }

  resetForm(): void {
    this.form.reset();
    this.removeValidations();
  }


  // Operations related functions

  getDeleteConfirmMessage(dataItem: Inventorycustomertype): string {
    return `Are you sure to remove \u201C ${dataItem.price} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Inventorycustomertype): string {
    if (this.isFormEmpty) {
      return `Are you sure to update \u201C\u00A0${dataItem.price}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.price}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void {
    if (this.form.invalid) {
      return;
    }

    const dataItem: Inventorycustomertype = new Inventorycustomertype();
    dataItem.id = this.idField.value;
    dataItem.price = this.priceField.value;
    dataItem.customertype = this.customertypeField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }


}
