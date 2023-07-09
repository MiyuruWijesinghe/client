import { Component, OnInit } from '@angular/core';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {FormControl} from '@angular/forms';
import {BranchService} from '../../../../services/branch.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Branch} from '../../../../entities/branch';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss']
})
export class BranchTableComponent extends AbstractComponent implements OnInit {


  branchDataPage: BranchDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  nameField = new FormControl();
  contactField = new FormControl();

  constructor(
    private branchService: BranchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<void>{

    this.updatePrivileges();

    if (this.privilege.showAll){
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex  = this.pageIndex;
      pageRequest.pageSize  = this.pageSize;


      pageRequest.addSearchCriteria('name', this.nameField.value);
      pageRequest.addSearchCriteria('contact', this.contactField.value);

      try{
        this.branchDataPage = await this.branchService.getAll(pageRequest);
      }catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_BRANCH);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'name', 'contacts', 'email'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branch: Branch): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branch.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.branchService.delete(branch.id);
      this.loadData();
    });
  }

}
