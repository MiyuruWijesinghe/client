import {Component, forwardRef, Input} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Inventory} from '../../../../../entities/inventory';
import {MatDialog} from '@angular/material/dialog';
import {Saleitem} from '../../../../../entities/saleitem';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Item} from '../../../../../entities/item';

@Component({
  selector: 'app-sale-item-update-sub-form',
  templateUrl: './sale-item-update-sub-form.component.html',
  styleUrls: ['./sale-item-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SaleItemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SaleItemUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class SaleItemUpdateSubFormComponent extends AbstractSubFormComponent <Saleitem> {

  @Input()
  items: Item[] = [];

  @Input()
  inventories: Inventory[] = [];
  fieldValidations = {
    qty: [],
    item: [],
    inventory: [],
    unitprice: []
  };

  // Form related variables and functions
  form = new FormGroup({
    id: new FormControl(null),
    qty: new FormControl('', this.fieldValidations.qty),
    item: new FormControl('', this.fieldValidations.item),
    unitprice: new FormControl('', this.fieldValidations.unitprice),
    inventory: new FormControl('', this.fieldValidations.inventory),
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

  get inventoryField(): FormControl {
    return this.form.controls.item as FormControl;
  }

  get unitpriceField(): FormControl {
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean {
    return this.isEmptyField(this.idField)
      && this.isEmptyField(this.qtyField)
      && this.isEmptyField(this.unitpriceField)
      && this.isEmptyField(this.inventoryField);
  }

  setValidations(): void {
    this.fieldValidations.qty = [Validators.required];
    this.fieldValidations.inventory = [Validators.required];
    this.fieldValidations.unitprice = [Validators.required];
    this.fieldValidations.item = [Validators.required];

  }

  removeValidations(): void {
    this.fieldValidations.qty = [];
    this.fieldValidations.inventory = [];
    this.fieldValidations.unitprice = [];
    this.fieldValidations.item = [];

  }

  fillForm(dataItem: Saleitem): void {
    this.idField.patchValue(dataItem.id);
    this.qtyField.patchValue(dataItem.qty);
    this.unitpriceField.patchValue(dataItem.unitprice);
    this.inventoryField.patchValue(dataItem.item);

    for (const item of this.items) {
      if (JSON.stringify(dataItem.item) === JSON.stringify(item)) {
        this.inventoryField.patchValue(item);

      }
    }
  }

  resetForm(): void {
    this.form.reset();
    this.removeValidations();
  }

  getDeleteConfirmMessage(dataItem: Saleitem): string {
    return `Are you sure to remove \u201C ${dataItem.qty} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Saleitem): string {
    if (this.isFormEmpty) {
      return `Are you sure to update \u201C\u00A0${dataItem.qty}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.qty}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void {
    if (this.form.invalid) {
      return;
    }

    const dataItem: Saleitem = new Saleitem();
    dataItem.id = this.idField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.unitprice = this.unitpriceField.value;
    dataItem.item = this.inventoryField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }

}
