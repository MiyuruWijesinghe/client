import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {ItemService} from '../../../../services/item.service';
import {ItemtypeService} from '../../../../services/itemtype.service';
import {ItemstatusService} from '../../../../services/itemstatus.service';
import {UnitService} from '../../../../services/unit.service';
import {Item} from '../../../../entities/item';
import {Itemtype} from '../../../../entities/itemtype';
import {Itemstatus} from '../../../../entities/itemstatus';
import {Unit} from '../../../../entities/unit';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {ItemBranchSubFormComponent} from './item-branch-sub-form/item-branch-sub-form.component';
import {Itemcategory} from '../../../../entities/itemcategory';
import {ItemcategoryService} from '../../../../services/itemcategory.service';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(ItemBranchSubFormComponent) itembranchSubForm: ItemBranchSubFormComponent;

  item: Item = new Item();
  branches: Branch[] = [];
  itemtypes: Itemtype[] = [];
  itemstatuses: Itemstatus[] = [];
  itemcategories: Itemcategory[] = [];
  units: Unit[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),

    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    itemtype: new FormControl('', [
      Validators.required
    ]),
    itemstatus: new FormControl('', [
      Validators.required,
    ]),
    unit: new FormControl('', [
      Validators.required
    ]),
    lastprice: new FormControl('', [
      Validators.required
    ]),
    itemcategory: new FormControl('', [
      Validators.required
    ]),
    itembranches: new FormControl(),
  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private itemService: ItemService,
    private itemtypeService: ItemtypeService,
    private itemstatusService: ItemstatusService,
    private unitService: UnitService,
    private itemcategoryService: ItemcategoryService,
    private branchService: BranchService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get nameField(): FormControl {
    return this.form.controls.name as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get itemtypeField(): FormControl {
    return this.form.controls.itemtype as FormControl;
  }

  get itemstatusField(): FormControl {
    return this.form.controls.itemstatus as FormControl;
  }

  get lastpriceField(): FormControl {
    return this.form.controls.lastprice as FormControl;
  }

  get unitField(): FormControl {
    return this.form.controls.unit as FormControl;
  }

  get itemcategoryField(): FormControl {
    return this.form.controls.itemcategory as FormControl;
  }

  get itembranchesField(): FormControl {
    return this.form.controls.itembranches as FormControl;
  }

  get messageField(): FormControl {
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl {
    return this.notificationForm.controls.systemUser as FormControl;
  }

  ngOnInit(): void {

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    if (!this.privilege.add) {
      return;
    }

    this.itemtypeService.getAll().then((data: Item[]) => {
      this.itemtypes = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.itemstatusService.getAll().then((data: Item[]) => {
      this.itemstatuses = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.itemcategoryService.getAll().then((data: Item[]) => {
      this.itemcategories = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.unitService.getAll().then((data: Item[]) => {
      this.units = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_ITEM);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  async submit(): Promise<void> {

    this.itembranchSubForm.resetForm();
    this.itembranchesField.markAsDirty();
    if (this.form.invalid) {
      return;
    }

    const item: Item = new Item();
    item.name = this.nameField.value;
    // item.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    item.description = this.descriptionField.value;
    item.itemtype = this.itemtypeField.value;
    item.itemstatus = this.itemstatusField.value;
    item.itemcategory = this.itemcategoryField.value;
    item.unit = this.unitField.value;
    item.lastprice = this.lastpriceField.value;
    item.itembranchList = this.itembranchesField.value;

    try {
      const resourceLink: ResourceLink = await this.itemService.add(item);
      await this.router.navigateByUrl('/items/' + resourceLink.id);
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  async sendMessage(): Promise<void> {
    if (this.notificationForm.invalid) {
      return;
    }
    const notification: Notification = new Notification();
    notification.message = this.messageField.value;
    try {
      await this.notificationService.add(this.systemUserField.value, notification);
      console.log(notification);
      this.snackBar.open('Message sent', null, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  resetNotificationForm(): void {
    this.notificationForm.reset({ value: '', disabled: false }, { emitEvent: false });
  }
}
