type ProfilePictureProps = {
  username: string;
};

export default function ProfilePicture({ username }: ProfilePictureProps) {
  return <div className="profile-avatar">{username.slice(0, 1).toUpperCase()}</div>;
}