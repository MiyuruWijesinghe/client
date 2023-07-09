import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Complain} from '../../../../entities/complain';
import {ActivatedRoute, Router} from '@angular/router';
import {ComplainService} from '../../../../services/complain.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {PageRequest} from '../../../../shared/page-request';
import {ItemDataPage} from '../../../../entities/item-data-page';

@Component({
  selector: 'app-complain-update-form',
  templateUrl: './complain-update-form.component.html',
  styleUrls: ['./complain-update-form.component.scss']
})
export class ComplainUpdateFormComponent extends AbstractComponent implements OnInit {

  complain: Complain;
  selectedId: number;
  items: Item[] = [];
  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    nic: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    item: new FormControl('', [
      Validators.required,
    ]),
  });



  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get contactField(): FormControl{
    return this.form.controls.contact as FormControl;
  }
    get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
  }


  constructor(
    private route: ActivatedRoute,
    private complainService: ComplainService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.complain = await this.complainService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAIN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_COMPLAINS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_COMPLAIN);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAIN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAIN);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }
    const newComplain: Complain = new Complain();
    newComplain.name = this.nameField.value;
    newComplain.nic = this.nicField.value;
    newComplain.contact = this.contactField.value;
    newComplain.address = this.addressField.value;
    newComplain.item = this.itemField.value;
    newComplain.description = this.descriptionField.value;

    try{
      const resourceLink: ResourceLink = await this.complainService.update(this.complain.id, newComplain);
      await this.router.navigateByUrl('/complains/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 500);
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  discardChanges(): void{
    this.form.patchValue(this.complain);
  }

  setValues(): void{
    if (this.nameField.pristine){ this.nameField.patchValue(this.complain.name); }
    if (this.nicField.pristine){ this.nicField.patchValue(this.complain.nic); }
    if (this.contactField.pristine){ this.contactField.patchValue(this.complain.contact); }
    if (this.addressField.pristine){ this.addressField.patchValue(this.complain.address); }
    if (this.itemField.pristine){ this.itemField.patchValue(this.complain.item.id); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.complain.description); }
  }
}
