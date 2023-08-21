// Post/index.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPostId, createComment } from '../../store/comments';
import { createSelector } from 'reselect';

// This selector gets the comments object from the state
const selectCommentsState = state => state.comments;

// This selector transforms the comments object into an array

// This selector transforms the comments object into an array
export const selectCommentsArray = createSelector(
  [selectCommentsState],
  comments => Object.values(comments)
);




function Post({ post, onPostClick, sessionUser }) {
    const dispatch = useDispatch();
    const comments = useSelector(selectCommentsArray);

    const [commentInputPostId, setCommentInputPostId] = useState(null);

    const handlePostContainerClick = (post) => {
        if (post.userId === sessionUser.id) {
            onPostClick(post);
        }
    };

    const handleCommentSubmit = async (e, postId) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const text = e.target.value.trim();
            dispatch(createComment({ text, postId }));
            e.target.value = ''; // clear the input
            setCommentInputPostId(null); // hide the input
        }
    };

    const openCommentBar = (postId) => (e) => {
        e.stopPropagation(); 
        setCommentInputPostId(postId); 
        dispatch(fetchCommentsByPostId(postId));
    };

    return (
        <div className="postContainer" onClick={() => handlePostContainerClick(post)}>
            <div className="postHeader">
                {post.userPhotoUrl ? 
                    <img src={post.userPhotoUrl} alt="Profile" className="postProfilePic"/> 
                    : 
                    <i className="fa-solid fa-user-circle postProfilePic"/>
                }
                <span className="postUsername">{post.username}</span> 
            </div>
            <p className="postBody">{post.body}</p>

            <button onClick={openCommentBar(post.id)}>Comment</button>
            
            {commentInputPostId === post.id && 
                <input 
                    type="text" 
                    placeholder="Add a comment..."
                    onKeyDown={e => handleCommentSubmit(e, post.id)}
                    onClick={e => e.stopPropagation()}
                />
            }

            {comments.filter(comment => comment.postId === post.id).map(comment => (
                <div key={comment.id} className="comment">
                    {comment.userPhotoUrl ? 
                        <img src={comment.userPhotoUrl} alt="Profile" className="commentProfilePic"/> 
                        : 
                        <i className="fa-solid fa-user-circle commentProfilePic"/>
                    }
                    <span className="commentUsername">{comment.username}</span>
                    {comment.text}
                </div>
            ))}
        </div>
    );
}

export default Post;

