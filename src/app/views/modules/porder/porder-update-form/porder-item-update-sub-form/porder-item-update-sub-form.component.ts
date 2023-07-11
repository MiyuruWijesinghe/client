import {Component, forwardRef, Input} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Porderitem} from '../../../../../entities/porderitem';
import {Item} from '../../../../../entities/item';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-porder-item-update-sub-form',
  templateUrl: './porder-item-update-sub-form.component.html',
  styleUrls: ['./porder-item-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PorderItemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PorderItemUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class PorderItemUpdateSubFormComponent extends AbstractSubFormComponent<Porderitem> {

  @Input()
  items: Item[] = [];
  fieldValidations = {
    qty: [],
    item: [],
  };

  form = new FormGroup({
    id: new FormControl(null),
    qty: new FormControl('', this.fieldValidations.qty),
    item: new FormControl('', this.fieldValidations.item),
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

  get isFormEmpty(): boolean {
    return this.isEmptyField(this.idField)
      && this.isEmptyField(this.qtyField)
      && this.isEmptyField(this.itemField);
  }

  setValidations(): void {
    this.fieldValidations.qty = [Validators.required];
    this.fieldValidations.item = [Validators.required];
  }

  removeValidations(): void {
    this.fieldValidations.qty = [];
    this.fieldValidations.item = [];
  }

  fillForm(dataItem: Porderitem): void {
    this.idField.patchValue(dataItem.id);
    this.qtyField.patchValue(dataItem.qty);
    this.itemField.patchValue(dataItem.item);

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

    const dataItem: Porderitem = new Porderitem();
    dataItem.id = this.idField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.item = this.itemField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
