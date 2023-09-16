import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../../store/profile';
import './UserProfile.css'; // Assuming you have a CSS file for styling

function UserProfile() {
  const dispatch = useDispatch();
  console.log("UserProfile component rendered with username:", username);
  const { username } = useParams();
  const user = useSelector((state) => state.profile.user);
  const activity = useSelector((state) => state.profile.activity);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  if (!user) return null; // Loading or no user found

  return (
    <div className="userProfileContainer">
      <div className="userDetails">
        <img src={user.userPhotoUrl} alt={`${user.username}'s profile`} />
        <h2>{user.username}</h2>
      </div>

      <div className="userActivity">
        <h3>Activity</h3>

        <div className="postsActivity">
          <h4>Posts</h4>
          {activity.posts.map((post) => (
            <div key={post.id}>{post.body}</div>
          ))}
        </div>

        <div className="commentsActivity">
          <h4>Comments</h4>
          {activity.comments.map((comment) => (
            <div key={comment.id}>{comment.text}</div>
          ))}
        </div>

        <div className="reactionsActivity">
          <h4>Reactions</h4>
          {activity.reactions.map((reaction) => (
            <div key={reaction.id}>{reaction.reactionType}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

