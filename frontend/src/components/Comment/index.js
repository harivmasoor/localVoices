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
    const [replyPhotos, setReplyPhotos] = useState({});





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
        e.preventDefault();
        e.stopPropagation();
    
        const text = e.currentTarget.elements.commentText.value.trim();
    
        if (text) {
            const commentData = new FormData();
            commentData.append('comment[text]', text);
    
            // Fetch the replyPhoto from replyPhotos using the current comment's ID
            const replyPhoto = replyPhotos[comment.id];
            if (replyPhoto) {
                commentData.append('comment[photo]', replyPhoto);
            }
    
            if (parentCommentId) {
                commentData.append('comment[parentCommentId]', parentCommentId);
            }
            commentData.append('comment[postId]', postId);
    
            dispatch(createComment(commentData));
            e.currentTarget.elements.commentText.value = '';
    
            // Reset after submission
            const { [comment.id]: _, ...remainingPhotos } = replyPhotos;
            setReplyPhotos(remainingPhotos);
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
                {comment.parentCommentId === null && comment.commentPhotoUrl && 
                    <img src={comment.commentPhotoUrl} alt="Comment Photo" className="commentPhoto" />
                }
    
    {comment.parentCommentId === null && <button onClick={ openReplyBar(comment.id)}>Reply</button>}

    
                    {replyToParentCommentId === comment.id && (
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id, comment.id)} onClick={e => e.stopPropagation()}>
                        <input
                            type="text"
                            name="commentText"
                            placeholder="Reply to this comment..."
                            onClick={e => e.stopPropagation()}
                        />
                        <input
                            type="file"
                            onChange={e => {
                                e.stopPropagation();
                                const updatedReplyPhotos = { ...replyPhotos, [comment.id]: e.currentTarget.files[0] };
                                setReplyPhotos(updatedReplyPhotos);
                            }}
                            
                            onClick={e => e.stopPropagation()}
                        />
                        <input type="submit" style={{ display: 'none' }} />
                    </form>
                )}
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
