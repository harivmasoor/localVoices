import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, fetchAllComments, fetchCommentsByPostId, updateComment, deleteComment } from '../../store/comments';
import { createReaction, deleteReaction,  updateReaction } from '../../store/reactions';
import { selectCommentsArray } from '../Post';
import './comment.css';



function Comment({ comment, post, sessionUser, parentCommentPhoto }) { 
    // State for editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const [editedPhoto, setEditedPhoto] = useState(null);
    const sessionUserReaction = useSelector(state => {
        const reactionArray = Object.values(state.reactions);
        const res = reactionArray.find(reaction => reaction.reactableType === 'Comment' && reaction.reactableId === comment.id);
        return res ? res : null;
    });
    const comments = useSelector(selectCommentsArray);
    const dispatch = useDispatch();  
    const [replyToParentCommentId, setReplyToParentCommentId] = useState(null);
    const [replyPhotos, setReplyPhotos] = useState({});
    const [parentReplyPhoto, setReplyCommentPhoto] = useState(null);





    const handleCommentReact = (reactionType, commentId) => (e) => {
        e.stopPropagation();
        if (sessionUserReaction && sessionUserReaction.reactionType === reactionType) {

            dispatch(deleteReaction(sessionUserReaction));  
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
        e.preventDefault();
        e.stopPropagation();
    
        const text = e.currentTarget.elements.replyText.value.trim();
    
        if (text) {
            const commentData = new FormData();
            commentData.append('comment[text]', text);
    

            if (parentReplyPhoto) {
                commentData.append('comment[photo]', parentReplyPhoto);
            }
    
            if (parentCommentId) {
                commentData.append('comment[parentCommentId]', parentCommentId);
            }
            commentData.append('comment[postId]', postId);
    
            dispatch(createComment(commentData));
            e.currentTarget.elements.replyText.value = '';
    
            // Reset after submission
            const { [comment.id]: _, ...remainingPhotos } = replyPhotos;
            setReplyPhotos(remainingPhotos);
        }
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
    // Handle update
    const handleUpdate = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData();
        formData.append('comment[text]', editedText);
        if (editedPhoto) {
            formData.append('comment[photo]', editedPhoto);
        }
        formData.append('comment[id]', comment.id);

        try {
            await dispatch(updateComment(formData));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    // Handle delete
    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent event propagation

        try {
            await dispatch(deleteComment(comment.id));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    return (
        <div>
            {sessionUser.id === comment.userId && !isEditing && (
                <>
                    <button onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}>Edit</button>

                    <button onClick={handleDelete}>Delete</button>
                </>
            )}

            {isEditing && (
                <form onSubmit={handleUpdate}>
                    <textarea 
                            value={editedText} 
                            onChange={(e) => {
                                e.stopPropagation();
                                setEditedText(e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                        />
                    <input type="file" onChange={(e) => setEditedPhoto(e.currentTarget.files[0])} />
                    <button 
                            type="submit" 
                            onClick={(e) => e.stopPropagation()}
                        >Update Comment</button>

                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}
                <div key={comment.id} className="comment" onClick={e => e.stopPropagation()}>
                <div className='commentHeader'>
                {comment.userPhotoUrl ? 
                    <img src={comment.userPhotoUrl} alt="Profile" className="commentProfilePic" id="test"/>
                    : 
                    <i className="fa-solid fa-user-circle commentProfilePic"/>
                }
                <span className="commentUsername">{comment.username}</span>
                </div>
                {comment.text}
                {comment.parentCommentId === null && comment.commentPhotoUrl && 
                    <img src={comment.commentPhotoUrl} alt="Comment Photo" className="commentPhoto" />
                }
    

    
                    {replyToParentCommentId === comment.id && (
                    <div className="replyFormContainer">
                        <form className="replyForm" onSubmit={(e) => handleCommentSubmit(e, post.id, comment.id)} onClick={e => e.stopPropagation()}>
                        <input id='replyInput'
                            type="text"
                            name="replyText"
                            placeholder="Reply to this comment..."
                            onClick={e => e.stopPropagation()}
                            />
                       <label className="uploadIconLabel">
                    <i className="fa-solid fa-upload"/> {/* Upload icon; replace with your desired icon class if you're using another icon set */}
                    <input 
                        type="file" 
                        className="hiddenFileInput"
                        id='replyPhotoInput'
                        onChange={(e) => {
                            e.stopPropagation();
                            setReplyCommentPhoto(e.currentTarget.files[0]);
                        }}
                        onClick={e => e.stopPropagation()} 
                    />
                </label>
                <input type="submit" style={{display: 'none'}} />  {/* Hidden submit button to trigger form submission on Enter key */}
                    </form>
                    </div>
                )}
            <div className="commentActions">
            <div className="customReactions" id="commentCustomReactions">
            <button 
                    className={`customReactionsButton ${sessionUserReaction ? 'reacted' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCommentReact('like', post.id)(e);
                    }}
                    >
                    {sessionUserReaction ? getEmoji(sessionUserReaction.reactionType) : '❤️'}
                </button>
    <div className="customReactionsDropdown" id='commentsDropDownId'>
        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'sad' ? 'reacted' : ''}`} 
            onClick={(e) => {
                e.stopPropagation();
                handleCommentReact('sad', post.id)(e);
            }}
            >
            😢
        </button>

        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'like' ? 'reacted' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                handleCommentReact('like', post.id)(e);
            }}
            >
            ❤️
        </button>

        <button 
            className={`customReactionOption ${sessionUserReaction && sessionUserReaction.reactionType === 'happy' ? 'reacted' : ''}`} 
            onClick={(e) => {
                e.stopPropagation();
                handleCommentReact('happy', post.id)(e);
            }}
            >
            😄
        </button>
        </div>
        {comment.parentCommentId === null && <button className='replyButton' onClick={ openReplyBar(comment.id)}>Reply</button>}
        </div>
        </div>
    
                    {getRepliesForComment(comment.id).map(reply => (
                        <div key={reply.id} className='replyHeader'>
                        <div className="reply">
                            {reply.userPhotoUrl ? 
                                <img src={reply.userPhotoUrl} alt="Profile" className="replyProfilePic"/> 
                                : 
                                <i className="fa-solid fa-user-circle replyProfilePic"/>
                            }
                            <span className="replyUsername">{reply.username}</span>
                            {reply.text}
                            </div>
                            {reply.commentPhotoUrl && 
                            <img src={reply.commentPhotoUrl} alt="Reply Photo" className="replyPhoto" />
                            }

                        </div>
                    ))}
        </div>
        </div>
    );
    
}

export default Comment;


//rerender on render 