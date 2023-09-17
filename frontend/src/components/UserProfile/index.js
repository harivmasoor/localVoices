import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../../store/profile';
import Post from '../Post';
import Comment from '../Comment';

function UserProfile() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const profile = useSelector((state) => state.profile);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  if (!profile.activity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{username}'s Activity</h1>

      <h2>Posts</h2>
      {profile.activity.posts.map(post => (
        <Post key={post.id} post={{...post, userPhotoUrl: profile.user.photoUrl}} onPostClick={() => {}} sessionUser={sessionUser} />
      ))}

      <h2>Comments</h2>
      {profile.activity.comments.map((comment) => (
        <Comment key={comment.id} comment={comment} sessionUser={sessionUser} />
      ))}

      <h2>Reactions</h2>
      {profile.activity.reactions.map((reaction) => (
        <div key={reaction.id}>{reaction.body}</div>
      ))}
    </div>
  );
}

export default UserProfile;








