import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.mode';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<Post[]>('http://localhost:4000/api/posts')
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title, content };
    console.log('Sending POST request with:', post);

    this.http.post<Post>('http://localhost:4000/api/posts', post)
      .subscribe(
        (newPost) => {
          console.log('POST request successful:', newPost);
          this.posts.push(newPost);
          this.postsUpdated.next([...this.posts]);
        },
        error => {
          console.error('POST request failed:', error);
        }
      );
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:4000/api/posts/${postId}`)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      }, error => {
        console.error('DELETE request failed:', error);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    return this.http.put<Post>(`http://localhost:4000/api/posts/${id}`, post)
      .subscribe((updatedPost) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = updatedPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      }, error => {
        console.error('PUT request failed:', error);
      });
  }



}
