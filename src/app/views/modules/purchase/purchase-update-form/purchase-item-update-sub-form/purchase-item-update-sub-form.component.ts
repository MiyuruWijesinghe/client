import {Component, forwardRef, Input} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Purchaseitem} from '../../../../../entities/purchaseitem';
import {Item} from '../../../../../entities/item';
import {MatDialog} from '@angular/material/dialog';
import {Porderitem} from '../../../../../entities/porderitem';
import {DateHelper} from '../../../../../shared/date-helper';

@Component({
  selector: 'app-purchase-item-update-sub-form',
  templateUrl: './purchase-item-update-sub-form.component.html',
  styleUrls: ['./purchase-item-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PurchaseItemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PurchaseItemUpdateSubFormComponent),
      multi: true,
    }
  ]
})

export class PurchaseItemUpdateSubFormComponent extends AbstractSubFormComponent<Purchaseitem> {

  @Input()
  items: Item[] = [];
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

  constructor(protected dialog: MatDialog) {
    super();
  }

  get idField(): FormControl {
    return this.form.controls.id as FormControl;
  }

  get qtyField(): FormControl {
    return this.form.controls.qty as FormControl;
  }

  get itemField(): FormControl {
    return this.form.controls.item as FormControl;
  }

  get doexpiredField(): FormControl {
    return this.form.controls.doexpired as FormControl;
  }

  get domanufacturedField(): FormControl {
    return this.form.controls.domanufactured as FormControl;
  }

  get batchnoField(): FormControl {
    return this.form.controls.batchno as FormControl;
  }

  get unitpriceField(): FormControl {
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean {
    return this.isEmptyField(this.idField)
      && this.isEmptyField(this.qtyField)
      && this.isEmptyField(this.itemField)
      && this.isEmptyField(this.unitpriceField)
      && this.isEmptyField(this.doexpiredField)
      && this.isEmptyField(this.domanufacturedField)
      && this.isEmptyField(this.batchnoField);
  }

  setValidations(): void {
    this.fieldValidations.qty = [Validators.required];
    this.fieldValidations.item = [Validators.required];
    this.fieldValidations.unitprice = [Validators.required];
    this.fieldValidations.batchno = [Validators.required];
    // this.fieldValidations.domanufactured = [ Validators.required ];
    // this.fieldValidations.doexpired = [ Validators.required ];

  }

  removeValidations(): void {
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
    this.itemField.patchValue(dataItem.item);
    this.unitpriceField.patchValue(dataItem.unitprice);
    this.batchnoField.patchValue(dataItem.batchno);
    this.domanufacturedField.patchValue(dataItem.domanufactured);
    this.doexpiredField.patchValue(dataItem.doexpired);

    for (const item of this.items) {
      if (JSON.stringify(dataItem.item) === JSON.stringify(item)) {
        this.itemField.patchValue(item);
      }
    }

  }

  resetForm(): void {
    this.form.reset();
    this.removeValidations();
  }

  getDeleteConfirmMessage(dataItem: Porderitem): string {
    return `Are you sure to remove \u201C ${dataItem.item.name} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Porderitem): string {
    if (this.isFormEmpty) {
      return `Are you sure to update \u201C\u00A0${dataItem.item.name}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.item.name}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void {
    if (this.form.invalid) {
      return;
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
