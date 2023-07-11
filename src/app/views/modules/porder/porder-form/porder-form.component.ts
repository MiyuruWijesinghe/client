import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PorderService} from '../../../../services/porder.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Porder} from '../../../../entities/porder';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {BranchService} from '../../../../services/branch.service';
import {SupplierService} from '../../../../services/supplier.service';
import {Branch} from '../../../../entities/branch';
import {Supplier} from '../../../../entities/supplier';
import {PageRequest} from '../../../../shared/page-request';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {DateHelper} from '../../../../shared/date-helper';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {PorderItemSubFormComponent} from './porder-item-sub-form/porder-item-sub-form.component';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-porder-form',
  templateUrl: './porder-form.component.html',
  styleUrls: ['./porder-form.component.scss']
})
export class PorderFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(PorderItemSubFormComponent) porderitemSubForm: PorderItemSubFormComponent;

  porder: Porder = new Porder();
  branches: Branch[] = [];
  suppliers: Supplier['itemList'] = [];
  items: Item[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    branch: new FormControl('', [
      Validators.required
    ]),
    supplier: new FormControl('', [
      Validators.required
    ]),
    dorequired: new FormControl('', [
      Validators.required
    ]),
    porderitems: new FormControl(),
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
    private porderservice: PorderService,
    private branchService: BranchService,
    private supplierService: SupplierService,
    private itemService: ItemService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get supplierField(): FormControl {
    return this.form.controls.supplier as FormControl;
  }

  get branchField(): FormControl {
    return this.form.controls.branch as FormControl;
  }

  get dorequiredField(): FormControl {
    return this.form.controls.dorequired as FormControl;
  }

  get porderitemsField(): FormControl {
    return this.form.controls.porderitems as FormControl;
  }

  get messageField(): FormControl {
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl {
    return this.notificationForm.controls.systemUser as FormControl;
  }

  ngOnInit(): void {
    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
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

    this.supplierService.getAll(new PageRequest()).then((data: SupplierDataPage) => {
      this.suppliers = data.content;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PORDER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PORDER);
  }

  async submit(): Promise<void> {

    this.porderitemSubForm.resetForm();
    this.porderitemsField.markAsDirty();
    if (this.form.invalid) {
      return;
    }

    const porder: Porder = new Porder();
    porder.description = this.descriptionField.value;
    porder.supplier = this.supplierField.value;
    porder.branch = this.branchField.value;
    porder.dorequired = DateHelper.getDateAsString(this.dorequiredField.value);
    porder.porderitemList = this.porderitemsField.value;

    try {
      const resourceLink: ResourceLink = await this.porderservice.add(porder);
      await this.router.navigateByUrl('/porders/' + resourceLink.id);
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
