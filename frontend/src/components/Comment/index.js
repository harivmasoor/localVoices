import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, fetchAllComments, fetchCommentsByPostId } from '../../store/comments';
import { createReaction, deleteReaction,  updateReaction } from '../../store/reactions';
import { selectCommentsArray } from '../Post';



function Comment({ comment, post, sessionUser, parentCommentPhoto }) { 
    const sessionUserReaction = useSelector(state => {
        const reactionArray = Object.values(state.reactions);
        const res = reactionArray.find(reaction => reaction.reactableType === 'Comment' && reaction.reactableId === comment.id);
        return res ? res : null;
    });
    const comments = useSelector(selectCommentsArray);
    const dispatch = useDispatch();  
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);




    const handleCommentReact = (reactionType, commentId) => (e) => {
        e.stopPropagation();
        if (sessionUserReaction && sessionUserReaction.reactionType === reactionType) {

            dispatch(deleteReaction(sessionUserReaction));  // Pass the entire reaction object
        } else if (sessionUserReaction) {
            dispatch(updateReaction({ reactionType, id: sessionUserReaction.id }));
        }
        else {
            dispatch(createReaction({ reactionType, reactableType: 'Comment', reactableId: comment.id, userId: sessionUser.id }));
        }
        
    };



    const openReplyBar = (parentCommentId) => (e) => {
        setReplyToParentCommentId(parentCommentId);
        e.stopPropagation();
    
    };

    const getRepliesForComment = (commentId) => {
        return comments.filter(comment => comment.parentCommentId === commentId);
    };
    const handleCommentSubmit = async (e, postId, parentCommentId = null) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            const text = e.target.value.trim();
            console.log("Submitting comment with parentCommentId:", parentCommentId);
            dispatch(createComment({ text, postId, parentCommentId }));
            e.target.value = '';
        }
    };
    return (
        <div>
                <div key={comment.id} className="comment">
                    {comment.userPhotoUrl ? 
                        <img src={comment.userPhotoUrl} alt="Profile" className="commentProfilePic"/> 
                        : 
                        <i className="fa-solid fa-user-circle commentProfilePic"/>
                    }
                    <span className="commentUsername">{comment.username}</span>
                    {comment.text}
                    {parentCommentPhoto && 
                    <img src={URL.createObjectURL(parentCommentPhoto)} alt="Comment Photo" className="commentPhoto" />
                }
    
                    <button onClick={ openReplyBar(comment.id)}>Reply</button>
    
                    {replyToParentCommentId === comment.id &&
                        <input 
                            type="text"
                            placeholder="Reply to this comment..."
                            onKeyDown={e => handleCommentSubmit(e, post.id, comment.id)}
                            onClick={e => e.stopPropagation()}
                        />
                    }
    
                    <div className="commentReactions">
                        {/* Like Emoji Button with Count for Comment */}
                        <button onClick={handleCommentReact('like', comment.id)}>
                            👍 {sessionUserReaction && sessionUserReaction.reactionType === 'like' ? 1 : 0}
                        </button>

                <button onClick={handleCommentReact('happy', comment.id)}>
                    😄 {sessionUserReaction && sessionUserReaction.reactionType === 'happy' ? 1 : 0}
                </button>

                <button onClick={handleCommentReact('sad', comment.id)}>
                    😢 {sessionUserReaction && sessionUserReaction.reactionType === 'sad' ? 1 : 0}
                </button>
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
        </div>
    );
    
}

export default Comment;
