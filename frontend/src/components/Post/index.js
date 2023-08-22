import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentsByPostId, createComment } from '../../store/comments';
import { createSelector } from 'reselect';
import { createReaction, deleteReaction } from '../../store/reactions';

const selectCommentsState = state => state.comments;

export const selectCommentsArray = createSelector(
  [selectCommentsState],
  comments => Object.values(comments)
);

function Post({ post, onPostClick, sessionUser }) {
    const sessionUserReaction = useSelector(state => {
        const reactionArray = Object.values(state.reactions)
        const res = reactionArray.find(reaction => reaction.reactableType === 'Post' && reaction.reactableId === post.id);
        return res ? res : null;
    });
    console.log("sessionUserReaction:", sessionUserReaction)
    const dispatch = useDispatch();
    const comments = useSelector(selectCommentsArray);

    const [commentInputPostId, setCommentInputPostId] = useState(null);
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [happyCount, setHappyCount] = useState(0);
    const [sadCount, setSadCount] = useState(0);
    const [currentUserReaction, setCurrentUserReaction] = useState(null);
    const [commentLikeCounts, setCommentLikeCounts] = useState({});
    const [commentHappyCounts, setCommentHappyCounts] = useState({});
    const [commentSadCounts, setCommentSadCounts] = useState({});
    const [commentUserReactions, setCommentUserReactions] = useState({});
    const [postUserReactions, setPostUserReactions] = useState({});


    const handleReact = (reactionType, entityType, entityId) => (e) => {
        e.stopPropagation();
        
        let currentReactionState;
        let setReactionState;
        let likeCountState;
        let happyCountState;
        let sadCountState;
        let setLikeCountState;
        let setHappyCountState;
        let setSadCountState;
        
        if (entityType === 'Post') {
            currentReactionState = postUserReactions[entityId];
            setReactionState = (reaction) => setPostUserReactions(prev => ({ ...prev, [entityId]: reaction }));
            likeCountState = likeCount;
            happyCountState = happyCount;
            sadCountState = sadCount;
            setLikeCountState = (count) => setLikeCount(prev => Math.max(prev + count, 0));
            setHappyCountState = (count) => setHappyCount(prev => Math.max(prev + count, 0));
            setSadCountState = (count) => setSadCount(prev => Math.max(prev + count, 0));
        } else if (entityType === 'Comment') {
            currentReactionState = commentUserReactions[entityId];
            setReactionState = (reaction) => setCommentUserReactions(prev => ({ ...prev, [entityId]: reaction }));
            likeCountState = commentLikeCounts[entityId] || 0;
            happyCountState = commentHappyCounts[entityId] || 0;
            sadCountState = commentSadCounts[entityId] || 0;
            setLikeCountState = (count) => setCommentLikeCounts(prev => ({ ...prev, [entityId]: Math.max(prev[entityId] + count, 0) }));
            setHappyCountState = (count) => setCommentHappyCounts(prev => ({ ...prev, [entityId]: Math.max(prev[entityId] + count, 0) }));
            setSadCountState = (count) => setCommentSadCounts(prev => ({ ...prev, [entityId]: Math.max(prev[entityId] + count, 0) }));
        }

        
        if (currentReactionState === reactionType) return;
            
        if (currentReactionState) {
            // Reverting the user's previous reaction.
            dispatch(deleteReaction({ reactionType: currentReactionState, entityType, entityId }));
        
            if (entityType === 'Post') {
                if (currentReactionState === 'like' && likeCount > 0) {
                    setLikeCount(likeCount - 1);
                } else if (currentReactionState === 'happy' && happyCount > 0) {
                    setHappyCount(happyCount - 1);
                } else if (currentReactionState === 'sad' && sadCount > 0) {
                    setSadCount(sadCount - 1);
                }
            } else if (entityType === 'Comment') {
                if (currentReactionState === 'like' && commentLikeCounts[entityId] > 0) {
                    setCommentLikeCounts(prev => ({ ...prev, [entityId]: prev[entityId] - 1 }));
                } else if (currentReactionState === 'happy' && commentHappyCounts[entityId] > 0) {
                    setCommentHappyCounts(prev => ({ ...prev, [entityId]: prev[entityId] - 1 }));
                } else if (currentReactionState === 'sad' && commentSadCounts[entityId] > 0) {
                    setCommentSadCounts(prev => ({ ...prev, [entityId]: prev[entityId] - 1 }));
                }
            }
        }
        
        
        dispatch(createReaction({ reactionType, reactableType: entityType, reactableId: entityId, userId: sessionUser.id }));
        setReactionState(reactionType);
        
        if (reactionType === 'like') {
            setLikeCountState(likeCountState + 1);
        } else if (reactionType === 'happy') {
            setHappyCountState(happyCountState + 1);
        } else if (reactionType === 'sad') {
            setSadCountState(sadCountState + 1);
        }   
    };
    
    

    const handleUndoReact = (reactionType, entityType, entityId) => (e) => {
        e.stopPropagation();

        dispatch(deleteReaction({ reactionType, entityType, entityId }));

        if (entityType === 'Post') {
            if (reactionType === 'like') setLikeCount(prev => Math.max(prev - 1, 0));
            if (reactionType === 'happy') setHappyCount(prev => Math.max(prev - 1, 0));
            if (reactionType === 'sad') setSadCount(prev => Math.max(prev - 1, 0));
            setPostUserReactions(prev => ({ ...prev, [entityId]: null }));
        } else if (entityType === 'Comment') {
            if (reactionType === 'like') setCommentLikeCounts(prev => ({ ...prev, [entityId]: Math.max((prev[entityId] || 1) - 1, 0) }));
            if (reactionType === 'happy') setCommentHappyCounts(prev => ({ ...prev, [entityId]: Math.max((prev[entityId] || 1) - 1, 0) }));
            if (reactionType === 'sad') setCommentSadCounts(prev => ({ ...prev, [entityId]: Math.max((prev[entityId] || 1) - 1, 0) }));
            setCommentUserReactions(prev => ({ ...prev, [entityId]: null }));
        }
    };   

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
            
            <div className="reactions">
            {/* Like Emoji Button with Count */}
            <button onClick={handleReact('like', 'Post', post.id)}>
                👍 {likeCount}
            </button>
            <button onClick={handleUndoReact('like', 'Post', post.id)}>
                Undo Like
            </button>

            {/* Happy Emoji Button with Count */}
            <button onClick={handleReact('happy', 'Post', post.id)}>
                😄 {happyCount}
            </button>
            <button onClick={handleUndoReact('happy', 'Post', post.id)}>
                Undo Happy
            </button>

            {/* Sad Emoji Button with Count */}
            <button onClick={handleReact('sad', 'Post', post.id)}>
                😢 {sadCount}
            </button>
            <button onClick={handleUndoReact('sad', 'Post', post.id)}>
                Undo Sad
            </button>
        </div>
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

                    <div className="commentReactions">
                        {/* Like Emoji Button with Count for Comment */}
                        <button onClick={handleReact('like', 'Comment', comment.id)}>
                            👍 {commentLikeCounts[comment.id] || 0}
                        </button>
                        <button onClick={handleUndoReact('like', 'Comment', comment.id)}>
                            Undo Like
                        </button>

                        {/* Happy Emoji Button with Count for Comment */}
                        <button onClick={handleReact('happy', 'Comment', comment.id)}>
                            😄 {commentHappyCounts[comment.id] || 0}
                        </button>
                        <button onClick={handleUndoReact('happy', 'Comment', comment.id)}>
                            Undo Happy
                        </button>

                        {/* Sad Emoji Button with Count for Comment */}
                        <button onClick={handleReact('sad', 'Comment', comment.id)}>
                            😢 {commentSadCounts[comment.id] || 0}
                        </button>
                        <button onClick={handleUndoReact('sad', 'Comment', comment.id)}>
                            Undo Sad
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

export default Post;







