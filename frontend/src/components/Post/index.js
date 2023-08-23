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
    const [parentCommentPhoto, setParentCommentPhoto] = useState(null);




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
        console.log('handlePostContainerClick called');
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
        console.log('handleCommentSubmit called', postId);
        e.preventDefault();
        e.stopPropagation();
        
        const text = e.currentTarget.elements.commentText.value.trim(); // get the text value from the form directly
    
        if (text) {        
            const commentData = new FormData();
            commentData.append('comment[text]', text);
            if (parentCommentPhoto) {
                commentData.append('comment[photo]', parentCommentPhoto);
            }
            if (parentCommentId) {
                commentData.append('comment[parentCommentId]', parentCommentId);
            }
            commentData.append('comment[postId]', postId);
            
            dispatch(createComment(commentData));
            e.currentTarget.elements.commentText.value = ''; // reset the text value in the form
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
            {post.photoUrl && <img src={post.photoUrl} alt="Uploaded Post" className="postImage" />}
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
                    <Comment key={comment.id} comment={comment} post={post} sessionUser={sessionUser} parentCommentPhoto={parentCommentPhoto}  />
                ))}

                    {commentInputPostId === post.id && 
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} onClick={e => e.stopPropagation()}>
                        <input 
                            type="text" 
                            name="commentText"
                            placeholder="Add a comment..."
                            onClick={e => e.stopPropagation()}
                        />
                        <input 
                            type="file" 
                            onChange={(e) => {
                                e.stopPropagation();
                                setParentCommentPhoto(e.currentTarget.files[0]);
                            }}
                            onClick={e => e.stopPropagation()} 
                        />
                        <input type="submit" style={{display: 'none'}} />  {/* Hidden submit button to trigger form submission on Enter key */}
                    </form>
                    }


                           
            </div>
        </div>
    );    
}

export default Post;







