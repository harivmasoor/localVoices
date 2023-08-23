import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { createReaction, deleteReaction, updateReaction } from '../../store/reactions';
import { fetchCommentsByPostId, createComment } from '../../store/comments'; // Assuming this is the correct import
import Comment from '../Comment';

const selectCommentsState = state => state.comments;

export const selectCommentsArray = createSelector(
  [selectCommentsState],
  comments => Object.values(comments)
);

function Post({ post, onPostClick, sessionUser }) {
    const sessionUserReaction = useSelector(state => {
        const reactionArray = Object.values(state.reactions);
        const res = reactionArray.find(reaction => reaction.reactableType === 'Post' && reaction.reactableId === post.id);
        return res ? res : null;
    });
    
    const dispatch = useDispatch();
    const allComments = useSelector(selectCommentsArray);
    const postComments = allComments.filter(comment => comment.postId === post.id);
    const [commentInputPostId, setCommentInputPostId] = useState(null);


    const handlePostReact = (reactionType, postId) => (e) => {
        e.stopPropagation();
        if (sessionUserReaction && sessionUserReaction.reactionType === reactionType) {
            dispatch(deleteReaction(sessionUserReaction));  // Pass the entire reaction object
        } else if (sessionUserReaction) {
            dispatch(updateReaction({ reactionType, id: sessionUserReaction.id }));
        }
        else {
            dispatch(createReaction({ reactionType, reactableType: 'Post', reactableId: post.id, userId: sessionUser.id }));
        }
        
    };
    
    

    const handlePostContainerClick = (post) => {
        if (post.userId === sessionUser.id) {
            onPostClick(post);
        }
    };
    
    const openCommentBar = (postId) => (e) => {
        e.stopPropagation(); 
        setCommentInputPostId(postId); 
        dispatch(fetchCommentsByPostId(postId));
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
                <button onClick={handlePostReact('like', post.id)}>
                    👍 {sessionUserReaction && sessionUserReaction.reactionType === 'like' ? 1 : 0}
                </button>

                <button onClick={handlePostReact('happy', post.id)}>
                    😄 {sessionUserReaction && sessionUserReaction.reactionType === 'happy' ? 1 : 0}
                </button>

                <button onClick={handlePostReact('sad', post.id)}>
                    😢 {sessionUserReaction && sessionUserReaction.reactionType === 'sad' ? 1 : 0}
                </button>
            </div>
    
            <div className="commentsSection">
            <button onClick={openCommentBar(post.id)}>Comment</button>
                {postComments.filter(comment => !comment.parentCommentId).map(comment => (
                    <Comment key={comment.id} comment={comment} post={post} sessionUser={sessionUser} />
                ))}

                {commentInputPostId === post.id && 
                <input 
                    type="text" 
                    placeholder="Add a comment..."
                    onKeyDown={e => handleCommentSubmit(e, post.id)}
                    onClick={e => e.stopPropagation()}
                />
            }
            </div>
        </div>
    );    
}

export default Post;







