import {Component, OnInit, ViewChild} from '@angular/core';
import {Inventory} from '../../../../entities/inventory';
import {Branch} from '../../../../entities/branch';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../../services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {InventoryService} from '../../../../services/inventory.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Customertype} from '../../../../entities/customertype';
import {InventoryCustomertypeSubFormComponent} from './inventory-customertype-sub-form/inventory-customertype-sub-form.component';
import {CustomertypeService} from '../../../../services/customertype.service';
import {Customer} from '../../../../entities/customer';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(InventoryCustomertypeSubFormComponent) inventorycustomertypeSubForm: InventoryCustomertypeSubFormComponent;

  inventory: Inventory = new Inventory();
  branches: Branch[] = [];
  items: Item[] = [];
  customertypes: Customertype[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    batchno: new FormControl('', [
      Validators.required,
    ]),
    doexpired: new FormControl('', [
      Validators.required,
    ]),
    domanufactured: new FormControl('', [
      Validators.required,
    ]),
    qty: new FormControl('', [
      Validators.required,
    ]),
    initqty: new FormControl('', [
      Validators.required,
    ]),
    item: new FormControl('', [
      Validators.required,
    ]),
    branch: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    inventorycustomertype: new FormControl(),

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
    private inventoryService: InventoryService,
    private customertypeService: CustomertypeService,
    private branchService: BranchService,
    private itemService: ItemService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get batchnoField(): FormControl {
    return this.form.controls.batchno as FormControl;
  }

  get qtyField(): FormControl {
    return this.form.controls.qty as FormControl;
  }

  get initqtyField(): FormControl {
    return this.form.controls.initqty as FormControl;
  }

  get itemField(): FormControl {
    return this.form.controls.item as FormControl;
  }

  get branchField(): FormControl {
    return this.form.controls.branch as FormControl;
  }

  get doexpiredField(): FormControl {
    return this.form.controls.doexpired as FormControl;
  }

  get domanufacturedField(): FormControl {
    return this.form.controls.domanufactured as FormControl;
  }

  get inventorycustomertypeField(): FormControl {
    return this.form.controls.inventorycustomertype as FormControl;
  }

  get messageField(): FormControl {
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl {
    return this.notificationForm.controls.systemUser as FormControl;
  }

  ngOnInit(): void {
    this.loadData();
    this.customertypeService.getAll().then((data: Customer[]) => {
      this.customertypes = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    if (!this.privilege.add) {
      return;
    }

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_INVENTORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_INVENTORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_INVENTORY);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_INVENTORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_INVENTORY);
  }

  async submit(): Promise<void> {
    this.inventorycustomertypeSubForm.resetForm();
    this.inventorycustomertypeField.markAsDirty();
    if (this.form.invalid) {
      return;
    }

    const inventory: Inventory = new Inventory();
    inventory.branch = this.branchField.value;
    inventory.initqty = this.initqtyField.value;
    inventory.batchno = this.batchnoField.value;
    inventory.qty = this.qtyField.value;
    inventory.item = this.itemField.value;
    inventory.inventorycustomertypeList = this.inventorycustomertypeField.value;
    inventory.doexpired = DateHelper.getDateAsString(this.doexpiredField.value);
    inventory.domanufactured = DateHelper.getDateAsString(this.domanufacturedField.value);

    try {
      const resourceLink: ResourceLink = await this.inventoryService.add(inventory);
      await this.router.navigateByUrl('/inventories/' + resourceLink.id);
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
