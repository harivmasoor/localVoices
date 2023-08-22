import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPostId, createComment } from '../../store/comments';
import { createSelector } from 'reselect';

const selectCommentsState = state => state.comments;

export const selectCommentsArray = createSelector(
  [selectCommentsState],
  comments => Object.values(comments)
);

function Post({ post, onPostClick, sessionUser }) {
    const dispatch = useDispatch();
    const comments = useSelector(selectCommentsArray);

    const [commentInputPostId, setCommentInputPostId] = useState(null);
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);

    const handlePostContainerClick = (post) => {
        if (post.userId === sessionUser.id) {
            onPostClick(post);
        }
    };

    const handleCommentSubmit = async (e, postId, parentCommentId = null) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const text = e.target.value.trim();
            console.log("Submitting comment with parentCommentId:", parentCommentId);
            dispatch(createComment({ text, postId, parentCommentId }));
            e.target.value = '';
            // setReplyToParentCommentId(null);
        }
    };

    const openCommentBar = (postId) => (e) => {
        e.stopPropagation(); 
        setCommentInputPostId(postId); 
        dispatch(fetchCommentsByPostId(postId));
    };

    const openReplyBar = (parentCommentId) => (e) => {
        e.stopPropagation();
        setReplyToParentCommentId(parentCommentId);
    };

    const getRepliesForComment = (commentId) => {
        return comments.filter(comment => comment.parentCommentId === commentId);
    }
    

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

            {comments.filter(comment => comment.postId === post.id && !comment.parentCommentId).map(comment => (
                <div key={comment.id} className="comment">
                    {comment.userPhotoUrl ? 
                        <img src={comment.userPhotoUrl} alt="Profile" className="commentProfilePic"/> 
                        : 
                        <i className="fa-solid fa-user-circle commentProfilePic"/>
                    }
                    <span className="commentUsername">{comment.username}</span>
                    {comment.text}

                    <button onClick={openReplyBar(comment.id)}>Reply</button>

                    {replyToParentCommentId === comment.id &&
                        <input 
                            type="text"
                            placeholder="Reply to this comment..."
                            onKeyDown={e => handleCommentSubmit(e, post.id, comment.id)}
                            onClick={e => e.stopPropagation()}
                        />
                    }

                    {getRepliesForComment(comment.id).map(reply => (
                        <div key={reply.id} className="reply">
                            {reply.userPhotoUrl ? 
                                <img src={reply.userPhotoUrl} alt="Profile" className="replyProfilePic"/> 
                                : 
                                <i className="fa-solid fa-user-circle replyProfilePic"/>
                            }
                            <span className="replyUsername">{reply.username}</span>
                            {reply.text}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Post;







