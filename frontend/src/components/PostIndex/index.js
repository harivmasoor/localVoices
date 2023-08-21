import React from 'react';
import { useSelector } from 'react-redux';
import Post from '../Post'; 
import { createSelector } from 'reselect';

const selectPostsState = state => state.posts;

export const selectPostsArray = createSelector(
  [selectPostsState],          // input selectors
  posts => Object.values(posts).reverse()  // transforming function
);

function PostIndex({ sessionUser, onPostClick }) {
    const posts = useSelector(selectPostsArray);

    return (
        <div className="postsContainer">
            {posts.map(post => (
                <Post 
                    key={post.id} 
                    post={post} 
                    sessionUser={sessionUser}
                    onPostClick={onPostClick}
                />
            ))}
        </div>
    );
}

export default PostIndex;


