import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-statistic',
  templateUrl: './user-statistic.component.html',
  styleUrls: ['./user-statistic.component.scss'],
})
export class UserStatisticComponent implements OnInit {
  constructor(private user: UserService) {}

  tableData: any;

  ngOnInit(): void {
    this.showStatistics();
  }

  showStatistics() {
    this.user.showStatistics().subscribe(() => {});
  }
}
