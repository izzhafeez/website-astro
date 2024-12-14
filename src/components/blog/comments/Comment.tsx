import React from 'react';
import Markdown from 'react-markdown';
import heartFull from '../../../img/common/heart-full.svg';
import trash from '../../../img/common/trash-full.svg';

export type CommentProps = {
  id: string;
  poster: string;
  content: string;
  datetime: string;
  likes: number;
  liked: boolean;
  added: boolean;
  deleteComment?: (id: string) => void;
  replyOf?: number;
  color: string;
}

const Comment = ({ id, poster, content, datetime, likes, liked, added, deleteComment, color }: CommentProps) => {
  const [hasLiked, setHasLiked] = React.useState(liked);
  const [numLikes, setLikes] = React.useState(likes);
  const currentTime = new Date().getTime();
  const timeSinceNow = currentTime - new Date(datetime).getTime();
  const isInYears = timeSinceNow > 31536000000;
  const isInMonths = timeSinceNow > 2592000000;
  const isInDays = timeSinceNow > 86400000;
  const isInHours = timeSinceNow > 3600000;
  const isInMinutes = timeSinceNow > 60000;
  const isInSeconds = timeSinceNow > 1000;
  var toShow = '';
  if (isInYears) {
    const years = Math.floor(timeSinceNow / 31536000000);
    toShow = `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (isInMonths) {
    const months = Math.floor(timeSinceNow / 2592000000);
    toShow = `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (isInDays) {
    const days = Math.floor(timeSinceNow / 86400000);
    toShow = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (isInHours) {
    const hours = Math.floor(timeSinceNow / 3600000);
    toShow = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (isInMinutes) {
    const minutes = Math.floor(timeSinceNow / 60000);
    toShow = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (isInSeconds) {
    const seconds = Math.floor(timeSinceNow / 1000);
    toShow = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }

  React.useEffect(() => {
    // update hasLikedState
    setHasLiked(liked);
  }, [liked]);

  const handleLike = () => {
    if (hasLiked) {
      fetch(`${import.meta.env.PUBLIC_MM}/api/comments/${id}/unlike`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        })
      // remove the id of the liked comment from localStorage
      const likedComments = localStorage.getItem('comments-liked');
      if (likedComments) {
        const likedCommentsArray = likedComments.split(',');
        const index = likedCommentsArray.indexOf(id);
        likedCommentsArray.splice(index, 1);
        localStorage.setItem('comments-liked', likedCommentsArray.join(','));
      }
    } else {
      fetch(`${import.meta.env.PUBLIC_MM}/api/comments/${id}/like`, {
        method: 'POST',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        })
      // save the id of the liked comment in localStorage
      const likedComments = localStorage.getItem('comments-liked');
      if (likedComments) {
        const likedCommentsArray = likedComments.split(',');
        likedCommentsArray.push(id);
        localStorage.setItem('comments-liked', likedCommentsArray.join(','));
      } else {
        localStorage.setItem('comments-liked', id);
      }
    }
    setLikes(hasLiked ? numLikes - 1 : numLikes + 1);
    setHasLiked(!hasLiked);
  }

  // you are only allowed to delete your own comments

  return (
    <div className='grid my-2'>
      <div className={`text-${color}-500 text-lg font-bold`}>
        {poster}
      </div>
      <div className='dark:text-white text-sm italic'>
        {toShow}
      </div>
      <div className='dark:text-white my-2'>
        <Markdown>{content}</Markdown>
      </div>
      <div className='flex items-center'>
        <img
          src={heartFull.src}
          alt='like'
          className={`w-4 h-4 cursor-pointer ${hasLiked ? 'grayscale-0' : 'grayscale'}`}
          onClick={handleLike}
        />
        <span className='dark:text-white text-sm ml-1'>{numLikes}</span>
        {added && (
          <img
            src={trash.src}
            alt='delete'
            className='w-4 h-4 cursor-pointer ml-2 dark:invert'
            onClick={() => deleteComment && deleteComment(id)}
          />
        )}
      </div>
    </div>
  )
};

export default Comment;