import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CustomerTableComponent } from './views/modules/customer/customer-table/customer-table.component';
import { CustomerFormComponent } from './views/modules/customer/customer-form/customer-form.component';
import { CustomerDetailComponent } from './views/modules/customer/customer-detail/customer-detail.component';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import { CustomerUpdateFormComponent } from './views/modules/customer/customer-update-form/customer-update-form.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EmployeeDetailComponent } from './views/modules/employee/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './views/modules/employee/employee-form/employee-form.component';
import { EmployeeTableComponent } from './views/modules/employee/employee-table/employee-table.component';
import { EmployeeUpdateFormComponent } from './views/modules/employee/employee-update-form/employee-update-form.component';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { SupplierFormComponent } from './views/modules/supplier/supplier-form/supplier-form.component';
import { SupplierTableComponent } from './views/modules/supplier/supplier-table/supplier-table.component';
import { SupplierDetailComponent } from './views/modules/supplier/supplier-detail/supplier-detail.component';
import { SupplierUpdateFormComponent } from './views/modules/supplier/supplier-update-form/supplier-update-form.component';
import { BranchFormComponent } from './views/modules/branch/branch-form/branch-form.component';
import { BranchDetailComponent } from './views/modules/branch/branch-detail/branch-detail.component';
import { BranchTableComponent } from './views/modules/branch/branch-table/branch-table.component';
import { BranchUpdateFormComponent } from './views/modules/branch/branch-update-form/branch-update-form.component';
import { ItemFormComponent } from './views/modules/item/item-form/item-form.component';
import { ItemTableComponent } from './views/modules/item/item-table/item-table.component';
import { ItemDetailComponent } from './views/modules/item/item-detail/item-detail.component';
import { ItemUpdateFormComponent } from './views/modules/item/item-update-form/item-update-form.component';
import { PorderFormComponent } from './views/modules/porder/porder-form/porder-form.component';
import { PorderDetailComponent } from './views/modules/porder/porder-detail/porder-detail.component';
import { PorderTableComponent } from './views/modules/porder/porder-table/porder-table.component';
import { PorderUpdateFormComponent } from './views/modules/porder/porder-update-form/porder-update-form.component';
import { PurchaseFormComponent } from './views/modules/purchase/purchase-form/purchase-form.component';
import { PurchaseTableComponent } from './views/modules/purchase/purchase-table/purchase-table.component';
import { PurchaseDetailComponent } from './views/modules/purchase/purchase-detail/purchase-detail.component';
import { PurchaseUpdateFormComponent } from './views/modules/purchase/purchase-update-form/purchase-update-form.component';
import { InventoryFormComponent } from './views/modules/inventory/inventory-form/inventory-form.component';
import { InventoryDetailComponent } from './views/modules/inventory/inventory-detail/inventory-detail.component';
import { InventoryTableComponent } from './views/modules/inventory/inventory-table/inventory-table.component';
import { InventoryUpdateFormComponent } from './views/modules/inventory/inventory-update-form/inventory-update-form.component';
import { ItemBranchSubFormComponent } from './views/modules/item/item-form/item-branch-sub-form/item-branch-sub-form.component';
import { ItemBranchUpdateSubFormComponent } from './views/modules/item/item-update-form/item-branch-update-sub-form/item-branch-update-sub-form.component';
import {MatTabsModule} from '@angular/material/tabs';
import { PorderItemSubFormComponent } from './views/modules/porder/porder-form/porder-item-sub-form/porder-item-sub-form.component';
import { PorderItemUpdateSubFormComponent } from './views/modules/porder/porder-update-form/porder-item-update-sub-form/porder-item-update-sub-form.component';
import { PurchaseItemSubFormComponent } from './views/modules/purchase/purchase-form/purchase-item-sub-form/purchase-item-sub-form.component';
import { PurchaseItemUpdateSubFormComponent } from './views/modules/purchase/purchase-update-form/purchase-item-update-sub-form/purchase-item-update-sub-form.component';
import { InventoryCustomertypeSubFormComponent } from './views/modules/inventory/inventory-form/inventory-customertype-sub-form/inventory-customertype-sub-form.component';
import { InventoryCustomertypeUpdateSubFormComponent } from './views/modules/inventory/inventory-update-form/inventory-customertype-update-sub-form/inventory-customertype-update-sub-form.component';
import {DualListboxComponent} from './shared/ui-components/dual-listbox/dual-listbox.component';
import { SaleFormComponent } from './views/modules/sale/sale-form/sale-form.component';
import { SaleTableComponent } from './views/modules/sale/sale-table/sale-table.component';
import { SaleDetailComponent } from './views/modules/sale/sale-detail/sale-detail.component';
import { SaleUpdateFormComponent } from './views/modules/sale/sale-update-form/sale-update-form.component';
import { SaleItemSubFormComponent } from './views/modules/sale/sale-form/sale-item-sub-form/sale-item-sub-form.component';
import { SalePaymentSubFormComponent } from './views/modules/sale/sale-form/sale-payment-sub-form/sale-payment-sub-form.component';
import { SaleItemUpdateSubFormComponent } from './views/modules/sale/sale-update-form/sale-item-update-sub-form/sale-item-update-sub-form.component';
import { SalePaymentUpdateSubFormComponent } from './views/modules/sale/sale-update-form/sale-payment-update-sub-form/sale-payment-update-sub-form.component';
import { ComplainFormComponent } from './views/modules/complain/complain-form/complain-form.component';
import { ComplainDetailComponent } from './views/modules/complain/complain-detail/complain-detail.component';
import { ComplainTableComponent } from './views/modules/complain/complain-table/complain-table.component';
import { ComplainUpdateFormComponent } from './views/modules/complain/complain-update-form/complain-update-form.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { YearWiseCustomerCountComponent } from './views/modules/report/year-wise-customer-count/year-wise-customer-count.component';
import {MatTableExporterModule} from 'mat-table-exporter';
import {ChartsModule} from 'ng2-charts';
import { YearWiseSaleCountComponent } from './views/modules/report/year-wise-sale-count/year-wise-sale-count.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {ConfirmDialogComponent} from './shared/views/confirm-dialog/confirm-dialog.component';
import { YearWiseSaleComponent } from './views/modules/report/year-wise-sale/year-wise-sale.component';
import { YearWisePurchaseComponent } from './views/modules/report/year-wise-purchase/year-wise-purchase.component';
import { YearWiseIncomeComponent } from './views/modules/report/year-wise-income/year-wise-income.component';
import { MonthWiseSaleComponent } from './views/modules/report/month-wise-sale/month-wise-sale.component';
import { DayWiseSaleComponent } from './views/modules/report/day-wise-sale/day-wise-sale.component';
import { ReportsComponent } from './views/modules/report/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainWindowComponent,
    DashboardComponent,
    PageNotFoundComponent,
    CustomerTableComponent,
    CustomerFormComponent,
    CustomerDetailComponent,
    PageHeaderComponent,
    CustomerUpdateFormComponent,
    NavigationComponent,
    EmployeeDetailComponent,
    EmployeeFormComponent,
    EmployeeTableComponent,
    EmployeeUpdateFormComponent,
    RoleDetailComponent,
    RoleFormComponent,
    RoleTableComponent,
    RoleUpdateFormComponent,
    UserDetailComponent,
    UserFormComponent,
    UserTableComponent,
    UserUpdateFormComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    DeleteConfirmDialogComponent,
    EmptyDataTableComponent,
    LoginTimeOutDialogComponent,
    Nl2brPipe,
    NoPrivilegeComponent,
    AdminConfigurationComponent,
    ObjectNotFoundComponent,
    LoadingComponent,
    SupplierFormComponent,
    SupplierTableComponent,
    SupplierDetailComponent,
    SupplierUpdateFormComponent,
    BranchFormComponent,
    BranchDetailComponent,
    BranchTableComponent,
    BranchUpdateFormComponent,
    ItemFormComponent,
    ItemTableComponent,
    ItemDetailComponent,
    ItemUpdateFormComponent,
    PorderFormComponent,
    PorderDetailComponent,
    PorderTableComponent,
    PorderUpdateFormComponent,
    PurchaseFormComponent,
    PurchaseTableComponent,
    PurchaseDetailComponent,
    PurchaseUpdateFormComponent,
    InventoryFormComponent,
    InventoryDetailComponent,
    InventoryTableComponent,
    InventoryUpdateFormComponent,
    ItemBranchSubFormComponent,
    ConfirmDialogComponent,
    ItemBranchUpdateSubFormComponent,
    PorderItemSubFormComponent,
    PorderItemUpdateSubFormComponent,
    PurchaseItemSubFormComponent,
    PurchaseItemUpdateSubFormComponent,
    InventoryCustomertypeSubFormComponent,
    InventoryCustomertypeUpdateSubFormComponent,
    DualListboxComponent,
    SaleFormComponent,
    SaleTableComponent,
    SaleDetailComponent,
    SaleUpdateFormComponent,
    SaleItemSubFormComponent,
    SalePaymentSubFormComponent,
    SaleItemUpdateSubFormComponent,
    SalePaymentUpdateSubFormComponent,
    ComplainFormComponent,
    ComplainDetailComponent,
    ComplainTableComponent,
    ComplainUpdateFormComponent,
    FileChooserComponent,
    YearWiseCustomerCountComponent,
    YearWiseSaleCountComponent,
    ChangePhotoComponent,
    MyAllNotificationComponent,
    ConfirmDialogComponent,
    YearWiseSaleComponent,
    YearWisePurchaseComponent,
    YearWiseIncomeComponent,
    MonthWiseSaleComponent,
    DayWiseSaleComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableExporterModule,
    ChartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
