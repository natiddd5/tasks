import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { NgIf } from "@angular/common";
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PostCreateComponent, HeaderComponent, PostListComponent, LoginComponent, RegisterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = "untitled6";
  showLogin = false;
  showRegister = false;
  showPostCreate = false;
  showPostList = true;  // Show the post list by default
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.showComponent('posts');
        } else {
          this.showComponent('login');
        }
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  showComponent(component: string) {
    this.showLogin = component === 'login';
    this.showRegister = component === 'register';
    this.showPostCreate = component === 'create';
    this.showPostList = component === 'posts';
  }
}
