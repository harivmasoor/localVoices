import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../../store/profile';

function UserProfile() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const activity = useSelector((state) => state.profile.activity);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  return (
    <div>
      <h1>{username}'s Activity</h1>

      {/* Check for the existence of activity and its properties before mapping */}
      <h2>Posts</h2>
      {activity && activity.posts && activity.posts.map((post) => (
        <div key={post.id}>{post.body}</div>
      ))}

      <h2>Comments</h2>
      {activity && activity.comments && activity.comments.map((comment) => (
        <div key={comment.id}>{comment.body}</div>
      ))}

      <h2>Reactions</h2>
      {activity && activity.reactions && activity.reactions.map((reaction) => (
        <div key={reaction.id}>{reaction.body}</div>
      ))}
    </div>
  );
}

export default UserProfile;


