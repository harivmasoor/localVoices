import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, fetchAllComments, fetchCommentsByPostId } from '../../store/comments';
import { createReaction, deleteReaction,  updateReaction } from '../../store/reactions';
import { selectCommentsArray } from '../Post';



function Comment({ comment, post, sessionUser }) { 
    const sessionUserReaction = useSelector(state => {
        const reactionArray = Object.values(state.reactions);
        const res = reactionArray.find(reaction => reaction.reactableType === 'Post' && reaction.reactableId === post.id);
        return res ? res : null;
    });
    const comments = useSelector(selectCommentsArray);
    const dispatch = useDispatch();  
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);
    // const [commentLikeCounts, setCommentLikeCounts] = useState({});
    // const [commentHappyCounts, setCommentHappyCounts] = useState({});
    // const [commentSadCounts, setCommentSadCounts] = useState({});
    // const [commentUserReactions, setCommentUserReactions] = useState({});

    const handleCommentReact = (reactionType, commentId) => (e) => {
        e.stopPropagation();
        if (sessionUserReaction && sessionUserReaction.reactionType === reactionType) {
            dispatch(deleteReaction(sessionUserReaction));  // Pass the entire reaction object
        } else if (sessionUserReaction) {
            dispatch(updateReaction({ reactionType, id: sessionUserReaction.id }));
        }
        else {
            dispatch(createReaction({ reactionType, reactableType: 'Comment', reactableId: post.id, userId: sessionUser.id }));
        }
        
    };
    // const handleCommentReact = (reactionType, commentId ) => (e) => {
    //     e.stopPropagation();
        
    //     const currentReactionState = commentUserReactions[commentId];
    
    //     if (currentReactionState === reactionType) return;
    
    //     if (currentReactionState) {
    //         dispatch(deleteReaction({ reactionType: currentReactionState, entityType: 'Comment', entityId: commentId }));
    //         if (currentReactionState === 'like') {
    //             setCommentLikeCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 0) - 1, 0) }));
    //         } else if (currentReactionState === 'happy') {
    //             setCommentHappyCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 0) - 1, 0) }));
    //         } else if (currentReactionState === 'sad') {
    //             setCommentSadCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 0) - 1, 0) }));
    //         }
    //     }
    
    //     dispatch(createReaction({ reactionType, reactableType: 'Comment', reactableId: commentId, userId: sessionUser.id }));
    //     if (reactionType === 'like') {
    //         setCommentLikeCounts(prev => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
    //     } else if (reactionType === 'happy') {
    //         setCommentHappyCounts(prev => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
    //     } else if (reactionType === 'sad') {
    //         setCommentSadCounts(prev => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
    //     }
    // };
    
    // const handleUndoCommentReact = (reactionType, commentId) => (e) => {
    //     e.stopPropagation();
    
    //     dispatch(deleteReaction({ reactionType, entityType: 'Comment', entityId: commentId }));
    
    //     if (reactionType === 'like') setCommentLikeCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 1) - 1, 0) }));
    //     if (reactionType === 'happy') setCommentHappyCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 1) - 1, 0) }));
    //     if (reactionType === 'sad') setCommentSadCounts(prev => ({ ...prev, [commentId]: Math.max((prev[commentId] || 1) - 1, 0) }));
    
    //     setCommentUserReactions(prev => ({ ...prev, [commentId]: null }));
    // };



    const openReplyBar = (parentCommentId) => (e) => {
        e.stopPropagation();
        setReplyToParentCommentId(parentCommentId);
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
            
    
            {comments.map(comment => (
                <div key={comment.id} className="comment">
                    {comment.userPhotoUrl ? 
                        <img src={comment.userPhotoUrl} alt="Profile" className="commentProfilePic"/> 
                        : 
                        <i className="fa-solid fa-user-circle commentProfilePic"/>
                    }
                    <span className="commentUsername">{comment.username}</span>
                    {comment.text}
    
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
                        <button onClick={handleCommentReact('like', post.id)}>
                            👍 {sessionUserReaction && sessionUserReaction.reactionType === 'like' ? 1 : 0}
                        </button>

                <button onClick={handleCommentReact('happy', post.id)}>
                    😄 {sessionUserReaction && sessionUserReaction.reactionType === 'happy' ? 1 : 0}
                </button>

                <button onClick={handleCommentReact('sad', post.id)}>
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
            ))}
        </div>
    );
    
}

export default Comment;
