import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier} from '../../../../entities/supplier';
import {Suppliertype} from '../../../../entities/suppliertype';
import {SupplierService} from '../../../../services/supplier.service';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {Designation} from '../../../../entities/designation';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {PageRequest} from '../../../../shared/page-request';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent extends AbstractComponent implements OnInit {
  supplier: Supplier = new Supplier();
  suppliertypes: Suppliertype[] = [];
  items: Item[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),

    contact1: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    contact2: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(255),
      Validators.email,
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),

    fax: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    suppliertype: new FormControl('', [
      Validators.required
    ]),
    item: new FormControl(),
  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }


  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get suppliertypeField(): FormControl{
    return this.form.controls.suppliertype as FormControl;
  }
  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
    private suppliertypeService: SuppliertypeService,
    private itemService: ItemService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    if (!this.privilege.add){ return; }

    this.suppliertypeService.getAll().then((data: Supplier[]) => {
      this.suppliertypes = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SUPPLIER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const supplier: Supplier = new Supplier();
    supplier.name = this.nameField.value;
    supplier.contact1 = this.contact1Field.value;
    supplier.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    supplier.email = this.emailField.value;
    supplier.address = this.addressField.value;
    supplier.description = this.descriptionField.value;
    supplier.suppliertype = this.suppliertypeField.value;
    supplier.itemList = this.itemField.value;
    supplier.fax = (this.faxField.value === '') ? null : this.faxField.value;
    try{
      const resourceLink: ResourceLink = await this.supplierService.add(supplier);
      await this.router.navigateByUrl('/suppliers/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  async sendMessage(): Promise<void> {
    if (this.notificationForm.invalid) { return; }
    const notification: Notification = new Notification();
    notification.message = this.messageField.value;
    try{
      await this.notificationService.add(this.systemUserField.value, notification);
      console.log(notification);
      this.notificationForm.reset();
      this.snackBar.open('Message sent', null, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

}
