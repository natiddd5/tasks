import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.mode';
import { PostsService } from '../posts.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
    MatFormField,
    MatInput,
    FormsModule,
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
    post.isEditing = true;
  }

  onSave(post: Post): void {
    this.postsService.updatePost(post.id, post.title, post.content);
    post.isEditing = false;
  }

  onCancel(post: Post): void {
    post.isEditing = false;
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
