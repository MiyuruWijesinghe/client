import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {CustomerTableComponent} from './views/modules/customer/customer-table/customer-table.component';
import {CustomerFormComponent} from './views/modules/customer/customer-form/customer-form.component';
import {CustomerDetailComponent} from './views/modules/customer/customer-detail/customer-detail.component';
import {CustomerUpdateFormComponent} from './views/modules/customer/customer-update-form/customer-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {SupplierTableComponent} from './views/modules/supplier/supplier-table/supplier-table.component';
import {SupplierFormComponent} from './views/modules/supplier/supplier-form/supplier-form.component';
import {SupplierDetailComponent} from './views/modules/supplier/supplier-detail/supplier-detail.component';
import {SupplierUpdateFormComponent} from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import {BranchTableComponent} from './views/modules/branch/branch-table/branch-table.component';
import {BranchFormComponent} from './views/modules/branch/branch-form/branch-form.component';
import {BranchDetailComponent} from './views/modules/branch/branch-detail/branch-detail.component';
import {BranchUpdateFormComponent} from './views/modules/branch/branch-update-form/branch-update-form.component';
import {ItemTableComponent} from './views/modules/item/item-table/item-table.component';
import {ItemFormComponent} from './views/modules/item/item-form/item-form.component';
import {ItemDetailComponent} from './views/modules/item/item-detail/item-detail.component';
import {ItemUpdateFormComponent} from './views/modules/item/item-update-form/item-update-form.component';
import {PorderTableComponent} from './views/modules/porder/porder-table/porder-table.component';
import {PorderFormComponent} from './views/modules/porder/porder-form/porder-form.component';
import {PorderDetailComponent} from './views/modules/porder/porder-detail/porder-detail.component';
import {PorderUpdateFormComponent} from './views/modules/porder/porder-update-form/porder-update-form.component';
import {PurchaseTableComponent} from './views/modules/purchase/purchase-table/purchase-table.component';
import {PurchaseFormComponent} from './views/modules/purchase/purchase-form/purchase-form.component';
import {PurchaseDetailComponent} from './views/modules/purchase/purchase-detail/purchase-detail.component';
import {PurchaseUpdateFormComponent} from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import {InventoryDetailComponent} from './views/modules/inventory/inventory-detail/inventory-detail.component';
import {InventoryFormComponent} from './views/modules/inventory/inventory-form/inventory-form.component';
import {InventoryUpdateFormComponent} from './views/modules/inventory/inventory-update-form/inventory-update-form.component';
import {InventoryTableComponent} from './views/modules/inventory/inventory-table/inventory-table.component';
import {SaleTableComponent} from './views/modules/sale/sale-table/sale-table.component';
import {SaleFormComponent} from './views/modules/sale/sale-form/sale-form.component';
import {SaleDetailComponent} from './views/modules/sale/sale-detail/sale-detail.component';
import {SaleUpdateFormComponent} from './views/modules/sale/sale-update-form/sale-update-form.component';
import {ComplainFormComponent} from './views/modules/complain/complain-form/complain-form.component';
import {ComplainDetailComponent} from './views/modules/complain/complain-detail/complain-detail.component';
import {ComplainTableComponent} from './views/modules/complain/complain-table/complain-table.component';
import {ComplainUpdateFormComponent} from './views/modules/complain/complain-update-form/complain-update-form.component';
import {YearWiseCustomerCountComponent} from './views/modules/report/year-wise-customer-count/year-wise-customer-count.component';
import {YearWiseSaleCountComponent} from './views/modules/report/year-wise-sale-count/year-wise-sale-count.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {YearWiseSaleComponent} from './views/modules/report/year-wise-sale/year-wise-sale.component';
import {YearWisePurchaseComponent} from './views/modules/report/year-wise-purchase/year-wise-purchase.component';
import {YearWiseIncomeComponent} from './views/modules/report/year-wise-income/year-wise-income.component';
import {MonthWiseSaleComponent} from './views/modules/report/month-wise-sale/month-wise-sale.component';
import {DayWiseSaleComponent} from './views/modules/report/day-wise-sale/day-wise-sale.component';
import {ReportsComponent} from './views/modules/report/reports.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [
      {path: 'customers', component: CustomerTableComponent},
      {path: 'customers/add', component: CustomerFormComponent},
      {path: 'customers/:id', component: CustomerDetailComponent},
      {path: 'customers/edit/:id', component: CustomerUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'suppliers', component: SupplierTableComponent},
      {path: 'suppliers/add', component: SupplierFormComponent},
      {path: 'suppliers/:id', component: SupplierDetailComponent},
      {path: 'suppliers/edit/:id', component: SupplierUpdateFormComponent},

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'branches', component: BranchTableComponent},
      {path: 'branches/add', component: BranchFormComponent},
      {path: 'branches/:id', component: BranchDetailComponent},
      {path: 'branches/edit/:id', component: BranchUpdateFormComponent},

      {path: 'items', component: ItemTableComponent},
      {path: 'items/add', component: ItemFormComponent},
      {path: 'items/:id', component: ItemDetailComponent},
      {path: 'items/edit/:id', component: ItemUpdateFormComponent},


      {path: 'porders', component: PorderTableComponent},
      {path: 'porders/add', component: PorderFormComponent},
      {path: 'porders/:id', component: PorderDetailComponent},
      {path: 'porders/edit/:id', component: PorderUpdateFormComponent},


      {path: 'purchases', component: PurchaseTableComponent},
      {path: 'purchases/add', component: PurchaseFormComponent},
      {path: 'purchases/:id', component: PurchaseDetailComponent},
      {path: 'purchases/edit/:id', component: PurchaseUpdateFormComponent},


      {path: 'inventories', component: InventoryTableComponent},
      {path: 'inventories/add', component: InventoryFormComponent},
      {path: 'inventories/:id', component: InventoryDetailComponent},
      {path: 'inventories/edit/:id', component: InventoryUpdateFormComponent},

      {path: 'sales', component: SaleTableComponent},
      {path: 'sales/add', component: SaleFormComponent},
      {path: 'sales/:id', component: SaleDetailComponent},
      {path: 'sales/edit/:id', component: SaleUpdateFormComponent},

      {path: 'complains', component: ComplainTableComponent},
      {path: 'complains/add', component: ComplainFormComponent},
      {path: 'complains/:id', component: ComplainDetailComponent},
      {path: 'complains/edit/:id', component: ComplainUpdateFormComponent},

      {path: 'reports/year-wise-customer-count', component: YearWiseCustomerCountComponent},
      {path: 'reports/month-wise-sale', component: MonthWiseSaleComponent},
      {path: 'reports/year-wise-sale-count', component: YearWiseSaleCountComponent},
      {path: 'reports/year-wise-sale', component: YearWiseSaleComponent},
      {path: 'reports/year-wise-purchase', component: YearWisePurchaseComponent},
      {path: 'reports/year-wise-income', component: YearWiseIncomeComponent},
      {path: 'reports/day-wise-sale', component: DayWiseSaleComponent},


      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},

      {path: 'reports', component: ReportsComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
