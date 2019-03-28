import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AlMufid BusinessBox';
  constructor(private authService: AuthService,
    private titleService: Title) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( 'newTitle' );
    }
}
