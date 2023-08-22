import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../Post'; 
import { createSelector } from 'reselect';
import { fetchUserReactions } from '../../store/reactions';

const selectPostsState = state => state.posts;
export const selectPostsArray = createSelector(
  [selectPostsState],          // input selectors
  posts => Object.values(posts).reverse()  // transforming function
);

function PostIndex({ sessionUser, onPostClick }) {
    const dispatch = useDispatch();
    const posts = useSelector(selectPostsArray);
    useEffect(() => {
        dispatch(fetchUserReactions(sessionUser.id));
    }, [dispatch, sessionUser.id]);

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


