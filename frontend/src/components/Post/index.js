import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { createReaction, deleteReaction, updateReaction } from '../../store/reactions';
import { fetchCommentsByPostId, createComment } from '../../store/comments'; // Assuming this is the correct import
import Comment from '../Comment';
import './post.css'

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
    const commentErrors = useSelector(state => state.errors.comments);
    const postComments = allComments.filter(comment => comment.postId === post.id);
    const [commentInputPostId, setCommentInputPostId] = useState(null);
    const [parentCommentPhoto, setParentCommentPhoto] = useState(null);
    const [showDivider, setShowDivider] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);




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
        setIsCommentSectionOpen(prevState => !prevState);
        // setCommentInputPostId(postId); 
        if (!isCommentSectionOpen) {
            dispatch(fetchCommentsByPostId(postId));
            setShowDivider(!showDivider); // toggle the divider
        }
    };
    const handleCommentSubmit = async (e, postId, parentCommentId = null) => {
        console.log('handleCommentSubmit called', postId);
        e.preventDefault();
        e.stopPropagation();
        
        const text = e.currentTarget.elements.commentText.value.trim(); // get the text value from the form directly
        if (!text) {
            setValidationError("Comment text cannot be empty.");
            return;
        }
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
        setValidationError(null);
    };
    
    function getEmoji(reactionType) {
        switch (reactionType) {
            case 'like':
                return '❤️';
            case 'happy':
                return '😄';
            case 'sad':
                return '😢';
            default:
                return '❤️';
        }
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
            {post.photoUrl && <img src={post.photoUrl} alt="Uploaded Post" className="postImage" />}


    

    <div className="postActions">
    <div className="customReactions">
    {/* Primary "like" button with dynamic emoji */}
    <button 
        className={`customReactionsButton ${sessionUserReaction ? 'reacted' : ''}`}
        onClick={(e) => {
            e.stopPropagation();
            handlePostReact('like', post.id)(e);
        }}
    >
        {sessionUserReaction ? getEmoji(sessionUserReaction.reactionType) : '❤️'}
    </button>

    {/* Dropdown for additional reactions */}
    <div className="customReactionsDropdown" >
        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'sad' ? 'reacted' : ''}`} 
            onClick={(e) => {
                e.stopPropagation();
                handlePostReact('sad', post.id)(e);
            }}
        >
            😢
        </button>

        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'like' ? 'reacted' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                handlePostReact('like', post.id)(e);
            }}
        >
            ❤️
        </button>

        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'happy' ? 'reacted' : ''}`} 
            onClick={(e) => {
                e.stopPropagation();
                handlePostReact('happy', post.id)(e);
            }}
        >
            😄
        </button>
        </div>
    </div>
            <button className='commentButton' onClick={openCommentBar(post.id)}>Comment</button>
</div>
{isCommentSectionOpen && 
    <>
        <div className="commentActions">
                            {commentErrors && commentErrors.map((error, idx) => (
                    <div key={idx} className="comment-error">{error}</div>
                ))}
                {validationError && <div className="comment-error">{validationError}</div>}
            <form className='commentForm'onSubmit={(e) => handleCommentSubmit(e, post.id)} onClick={e => e.stopPropagation()}>
                <input 
                    type="text" 
                    name="commentText"
                    placeholder="Add a comment..."
                    onClick={e => e.stopPropagation()}
                    className="commentInput"
                />
                <label className="uploadIconLabel">
                    <i className="fa-solid fa-upload"/> {/* Upload icon; replace with your desired icon class if you're using another icon set */}
                    <input 
                        type="file" 
                        className="hiddenFileInput"
                        onChange={(e) => {
                            e.stopPropagation();
                            setParentCommentPhoto(e.currentTarget.files[0]);
                        }}
                        onClick={e => e.stopPropagation()} 
                    />
                </label>
                <input type="submit" style={{display: 'none'}} />  {/* Hidden submit button to trigger form submission on Enter key */}
            </form>
        </div>
                    <div className="commentsSection">
                    {postComments.filter(comment => !comment.parentCommentId).map(comment => (
                        <Comment key={comment.id} comment={comment} post={post} sessionUser={sessionUser} parentCommentPhoto={parentCommentPhoto}  />
                    ))}
            </div>
            </>
            }
    </div>
);
}

export default Post;

//dssasdf test




