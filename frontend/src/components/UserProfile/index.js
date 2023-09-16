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

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{username}'s Activity</h1>

      <h2>Posts</h2>
      {activity.posts.map((post) => (
        <div key={post.id}>{post.body}</div>
      ))}

      <h2>Comments</h2>
      {activity.comments.map((comment) => (
        <div key={comment.id}>{comment.body}</div>
      ))}

      <h2>Reactions</h2>
      {activity.reactions.map((reaction) => (
        <div key={reaction.id}>{reaction.body}</div>
      ))}
    </div>
  );
}

export default UserProfile;



