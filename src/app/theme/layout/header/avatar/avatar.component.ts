import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: []
})
export class AvatarComponent implements OnInit {
  avatarUrl: string;
  constructor(private accountService: AccountService) {
    this.avatarUrl = this.accountService.getAvartars();
  }

  ngOnInit(): void {
    this.accountService.avatarSubject.subscribe(data => {
      console.log('accountService.avatarSubject', data);
      this.avatarUrl = data;
    });
  }
}
