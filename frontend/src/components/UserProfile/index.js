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
      <h1>All {username}'s Posts</h1>

      <h2>Posts</h2>
      {profile.activity.posts.map(post => (
        <Post key={post.id} post={{...post, userPhotoUrl: profile.user.photoUrl}} onPostClick={() => {}} sessionUser={sessionUser} />
      ))}
    </div>
  );
}

export default UserProfile;










