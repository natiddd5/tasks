import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.mode';
import { PostsService } from '../posts.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatCardActions,
    MatButton,
    NgIf,
    NgFor
  ],
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  storedPosts: Post[] = [];
  private postSub!: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.storedPosts = posts;
      });
  }

  onDelete(postId: string): void {
    this.postsService.deletePost(postId);
  }

  onEdit(post: Post): void {
    const newTitle = prompt('Edit Title:', post.title);
    const newContent = prompt('Edit Content:', post.content);

    if (newTitle !== null && newContent !== null) {
      this.postsService.updatePost(post.id, newTitle, newContent);
    }
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
