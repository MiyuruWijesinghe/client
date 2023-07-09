import { Component, OnInit } from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent extends AbstractComponent implements OnInit {

  branch: Branch;
  selectedId: number;

  constructor(
    private branchService: BranchService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.branch.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.branchService.delete(this.branch.id);
      await this.router.navigateByUrl('/branches');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.branch = await this.branchService.get(this.selectedId);
    console.log(this.branch.tocreation);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_BRANCH);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }
}
