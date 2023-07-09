import {Component, OnInit, ViewChild} from '@angular/core';
import {Item} from '../../../../entities/item';
import {Itemstatus} from '../../../../entities/itemstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../../../services/item.service';
import {ItemstatusService} from '../../../../services/itemstatus.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {Itemtype} from '../../../../entities/itemtype';
import {Unit} from '../../../../entities/unit';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ItemtypeService} from '../../../../services/itemtype.service';
import {UnitService} from '../../../../services/unit.service';
import {ItemBranchUpdateSubFormComponent} from './item-branch-update-sub-form/item-branch-update-sub-form.component';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {BranchService} from '../../../../services/branch.service';
import {Branch} from '../../../../entities/branch';
import {Itemcategory} from '../../../../entities/itemcategory';
import {ItemcategoryService} from '../../../../services/itemcategory.service';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-item-update-form',
  templateUrl: './item-update-form.component.html',
  styleUrls: ['./item-update-form.component.scss']
})
export class ItemUpdateFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(ItemBranchUpdateSubFormComponent) itembranchupdateSubForm: ItemBranchUpdateSubFormComponent;


  selectedId: number;

  item: Item = new Item();
  itemtypes: Itemtype[] = [];
  itemstatuses: Itemstatus[] = [];
  itemcategories: Itemcategory[] = [];
  units: Unit[] = [];
  branches: Branch[];
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
    itemcategory: new FormControl('', [
      Validators.required,
    ]),
    unit: new FormControl('', [
      Validators.required
    ]),
    lastprice: new FormControl('', [
      Validators.required
    ]),
    itembranches: new FormControl()

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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get itemtypeField(): FormControl{
    return this.form.controls.itemtype as FormControl;
  }

  get itemstatusField(): FormControl{
    return this.form.controls.itemstatus as FormControl;
  }
  get itemcategoryField(): FormControl{
    return this.form.controls.itemcategory as FormControl;
  }

  get lastpriceField(): FormControl{
    return this.form.controls.lastprice as FormControl;
  }
  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }
  get itembranchesField(): FormControl{
    return this.form.controls.itembranches as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private itemService: ItemService,
    private itemtypeService: ItemtypeService,
    private itemstatusService: ItemstatusService,
    private itemcategoryService: ItemcategoryService,
    private unitService: UnitService,
    private branchService: BranchService,
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');


      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }
    if (!this.privilege.add){ return; }

    if (this.itemstatusField.pristine) {
      this.itemstatusService.getAll().then((data: Itemstatus[]) => {
        this.itemstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.itemcategoryField.pristine) {
      this.itemcategoryService.getAll().then((data: Itemcategory[]) => {
        this.itemcategories = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.itemtypeField.pristine) {
      this.itemtypeService.getAll().then((data: Itemtype[]) => {
        this.itemtypes = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.unitField.pristine) {
      this.unitService.getAll().then((data: Unit[]) => {
        this.units = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    this.item = await this.itemService.get(this.selectedId);
    this.setValues();

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
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

  discardChanges(): void{
    this.itembranchupdateSubForm.resetForm();
    this.itembranchesField.markAsPristine();
    this.form.patchValue(this.item);
  }

  setValues(): void{
    if (this.nameField.pristine){ this.nameField.patchValue(this.item.name); }
    if (this.lastpriceField.pristine){ this.lastpriceField.patchValue(this.item.lastprice); }
    if (this.itemtypeField.pristine){ this.itemtypeField.patchValue(this.item.itemtype.id); }
    if (this.itemstatusField.pristine){ this.itemstatusField.patchValue(this.item.itemstatus.id); }
    if (this.itemcategoryField.pristine){ this.itemcategoryField.patchValue(this.item.itemcategory.id); }
    if (this.unitField.pristine){ this.unitField.patchValue(this.item.unit.id); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.item.description); }
    if (this.itembranchesField.pristine){ this.itembranchesField.patchValue(this.item.itembranchList); }
      }

  async submit(): Promise<void> {

    this.itembranchupdateSubForm.resetForm();
    this.itembranchesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newItem: Item = new Item();
    newItem.name = this.nameField.value;
    newItem.lastprice = this.lastpriceField.value;
    newItem.description = this.descriptionField.value;
    newItem.itemstatus = this.itemstatusField.value;
    newItem.itemcategory = this.itemcategoryField.value;
    newItem.itemtype = this.itemtypeField.value;
    newItem.unit = this.unitField.value;
    newItem.itembranchList = this.itembranchesField.value;


    try{
      const resourceLink: ResourceLink = await this.itemService.update(this.item.id, newItem);
      await this.router.navigateByUrl('/items/' + resourceLink.id);
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
