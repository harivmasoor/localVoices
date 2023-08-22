import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/comments';
import { createReaction, deleteReaction } from '../../store/reactions';

const selectCommentsState = state => state.comments;

export const selectCommentsArray = createSelector(
    [selectCommentsState],
    comments => Object.values(comments)
  );

  
function Comment({ post, sessionUser }) {
    const dispatch = useDispatch();
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);

    const handleCommentSubmit = async (e, postId, parentCommentId = null) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const text = e.target.value.trim();
            dispatch(createComment({ text, postId, parentCommentId }));
            e.target.value = '';
        }
    };

    const openReplyBar = (parentCommentId) => (e) => {
        e.stopPropagation();
        setReplyToParentCommentId(parentCommentId);
    };


    const getRepliesForComment = (commentId) => {
        return comments.filter(comment => comment.parentCommentId === commentId);
    }

    return (
        <div>
            <input 
                type="text" 
                placeholder="Add a comment..."
                onKeyDown={e => handleCommentSubmit(e, post.id)}
                onClick={e => e.stopPropagation()}
            />

            {/* The below code needs comment data from parent component or redux store */}
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

                    {/* Reactions for comment will also be needed, but skipped for brevity */}
                    <div className="commentReactions">
                        {/* Emoji buttons for comments... */}
                    </div>

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

export default Comment;
