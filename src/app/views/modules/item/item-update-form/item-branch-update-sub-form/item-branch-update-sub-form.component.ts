import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Itembranch} from '../../../../../entities/itembranch';
import {Branch} from '../../../../../entities/branch';
import {MatDialog} from '@angular/material/dialog';
import {Item} from '../../../../../entities/item';

@Component({
  selector: 'app-item-branch-update-sub-form',
  templateUrl: './item-branch-update-sub-form.component.html',
  styleUrls: ['./item-branch-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ItemBranchUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ItemBranchUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ItemBranchUpdateSubFormComponent extends AbstractSubFormComponent<Itembranch>{

  @Input()
  branches: Branch[] = [];
  items: Item[] = [];



  constructor(protected dialog: MatDialog) {
    super();
  }

  // Form related variables and functions

  fieldValidations = {
    rop: [],
    branch: [],
  };

  form = new FormGroup({
    id: new FormControl(null),
    rop: new FormControl('', this.fieldValidations.rop),
    branch: new FormControl('', this.fieldValidations.branch),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get ropField(): FormControl{
    return this.form.controls.rop as FormControl;
  }

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.ropField)
      &&   this.isEmptyField(this.branchField);
  }

  setValidations(): void{
    this.fieldValidations.rop = [ Validators.required ];
    this.fieldValidations.branch = [ Validators.required ];
  }

  removeValidations(): void{
    this.fieldValidations.rop = [];
    this.fieldValidations.branch = [];
  }

  fillForm(dataItem: Itembranch): void {
    this.idField.patchValue(dataItem.id);
    this.ropField.patchValue(dataItem.rop);
    this.branchField.patchValue(dataItem.branch);

    for (const branch of this.branches) {
      if (JSON.stringify(dataItem.branch) === JSON.stringify(branch)) {
        this.branchField.patchValue(branch);
      }
    }
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }



  // Operations related functions

  getDeleteConfirmMessage(dataItem: Itembranch): string {
    return `Are you sure to remove \u201C ${dataItem.branch.name} \u201D from granted branches`;
  }

  getUpdateConfirmMessage(dataItem: Itembranch): string {
    if (this.isFormEmpty){
      return `Are you sure to update \u201C\u00A0${dataItem.branch.name}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.branch.name}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Itembranch = new Itembranch();
    dataItem.id = this.idField.value;
    dataItem.rop = this.ropField.value;
    dataItem.branch = this.branchField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
