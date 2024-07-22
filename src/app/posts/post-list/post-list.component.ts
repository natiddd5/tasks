import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from "@angular/material/expansion";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import {Post} from "../post.mode";
import {MatButton} from "@angular/material/button";
import {MatCardActions} from "@angular/material/card";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatButton,
    MatCardActions
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  storedPosts: Post[] = [];
  private postSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  ngOnInit(): void {
    this.storedPosts = this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.storedPosts = posts;
      });
  }
}
