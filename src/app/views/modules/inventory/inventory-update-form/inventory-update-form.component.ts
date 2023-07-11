import {Component, OnInit, ViewChild} from '@angular/core';
import {Inventory} from '../../../../entities/inventory';
import {Supplier} from '../../../../entities/supplier';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DateHelper} from '../../../../shared/date-helper';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {InventoryService} from '../../../../services/inventory.service';
import {Customertype} from '../../../../entities/customertype';
import {InventoryCustomertypeUpdateSubFormComponent} from './inventory-customertype-update-sub-form/inventory-customertype-update-sub-form.component';
import {CustomertypeService} from '../../../../services/customertype.service';
import {Customer} from '../../../../entities/customer';
import {PageRequest} from '../../../../shared/page-request';
import {InventoryDataPage} from '../../../../entities/inventory-data-page';
import {BranchService} from '../../../../services/branch.service';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-inventory-update-form',
  templateUrl: './inventory-update-form.component.html',
  styleUrls: ['./inventory-update-form.component.scss']
})
export class InventoryUpdateFormComponent extends AbstractComponent implements OnInit {
  @ViewChild(InventoryCustomertypeUpdateSubFormComponent) inventorycustomertypeSubForm: InventoryCustomertypeUpdateSubFormComponent;

  selectedId: number;
  inventory: Inventory;

  items: Supplier[] = [];
  customertypes: Customertype[] = [];
  inventories: Inventory[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({

    batchno: new FormControl({value: '', disabled: true}, [
      Validators.maxLength(65535),
    ]),
    qty: new FormControl({value: '', disabled: true}, [
      Validators.required
    ]),
    doexpired: new FormControl({value: '', disabled: true}, [
      Validators.required
    ]),
    domanufactured: new FormControl({value: '', disabled: true}, [
      Validators.required
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
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get domanufacturedField(): FormControl {
    return this.form.controls.domanufactured as FormControl;
  }

  get doexpiredField(): FormControl {
    return this.form.controls.doexpired as FormControl;
  }

  get qtyField(): FormControl {
    return this.form.controls.qty as FormControl;
  }

  get batchnoField(): FormControl {
    return this.form.controls.batchno as FormControl;
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
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');

      this.customertypeService.getAll().then((data: Customer[]) => {
        this.customertypes = data;
      }).catch(e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });

      this.refreshData();

      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {

    this.inventoryService.getAll(new PageRequest()).then((data: InventoryDataPage) => {
      this.inventories = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.updatePrivileges();

    this.inventory = await this.inventoryService.get(this.selectedId);
    this.setValues();

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

  discardChanges(): void {
    this.inventorycustomertypeSubForm.resetForm();
    this.inventorycustomertypeField.markAsPristine();
    this.form.patchValue(this.inventory);
  }

  setValues(): void {
    if (this.doexpiredField.pristine) {
      this.doexpiredField.patchValue(this.inventory.doexpired);
    }
    if (this.domanufacturedField.pristine) {
      this.domanufacturedField.patchValue(this.inventory.domanufactured);
    }
    if (this.batchnoField.pristine) {
      this.batchnoField.patchValue(this.inventory.batchno);
    }
    if (this.qtyField.pristine) {
      this.qtyField.patchValue(this.inventory.qty);
    }
    if (this.inventorycustomertypeField.pristine) {
      this.inventorycustomertypeField.patchValue(this.inventory.inventorycustomertypeList);
    }
  }

  async submit(): Promise<void> {
    this.inventorycustomertypeSubForm.resetForm();
    this.inventorycustomertypeField.markAsDirty();
    if (this.form.invalid) {
      return;
    }
    const newInventory: Inventory = new Inventory();

    newInventory.qty = this.qtyField.value;
    newInventory.domanufactured = DateHelper.getDateAsString(this.domanufacturedField.value as Date);
    newInventory.doexpired = DateHelper.getDateAsString(this.doexpiredField.value as Date);
    newInventory.batchno = this.batchnoField.value;
    newInventory.inventorycustomertypeList = this.inventorycustomertypeField.value;


    try {
      const resourceLink: ResourceLink = await this.inventoryService.update(this.inventory.id, newInventory);
      await this.router.navigateByUrl('/inventories/' + resourceLink.id);
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
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
