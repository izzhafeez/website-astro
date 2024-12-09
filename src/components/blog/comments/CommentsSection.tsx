import React from 'react';
import Comment, { type CommentProps } from './Comment';
import CommentEditor from './CommentEditor';

const CommentsSection = ({ id }: { id: string }) => {
  const [comments, setComments] = React.useState([] as CommentProps[]);
  const [loaded, setLoaded] = React.useState(false);
  const refreshComments = () => {
    setLoaded(false);
    const MM = import.meta.env.PUBLIC_MM;
    const url = `${MM}/api/comments/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  React.useEffect(() => {
    refreshComments();
  }, [id]);

  // retrieve a list of comments that the user has liked from localStorage
  React.useEffect(() => {
    const likedComments = localStorage.getItem('comments-liked') || '';
    const addedComments = localStorage.getItem('comments-added') || '';
    const likedCommentsArray = likedComments.split(',');
    const addedCommentsArray = addedComments.split(',');
    const newComments = comments.map((comment) => {
      const newComment = { ...comment };
      newComment.liked = likedCommentsArray.includes(comment.id);
      newComment.added = addedCommentsArray.includes(comment.id);
      return newComment;
    });
    setComments(newComments);
  }, [loaded]);

  const deleteComment = (id: string) => {
    const MM = import.meta.env.PUBLIC_MM;
    const url = `${MM}/api/comments/${id}`;
    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        const newComments = comments.filter((comment) => comment.id !== id);
        setComments(newComments);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className=''>
      <h2 className='text-3xl text-cc-500 font-extrabold'>COMMENTS</h2>
      <CommentEditor id={id} refreshComments={refreshComments}/>
      {!loaded && <p>Loading comments...</p>}
      {comments.map((comment, index) => (
        <Comment
          key={index}
          id={comment.id}
          deleteComment={deleteComment}
          added={comment.added}
          liked={comment.liked}
          poster={comment.poster}
          content={comment.content}
          datetime={comment.datetime}
          likes={comment.likes}
        />
      ))}
    </div>
  );
}

export default CommentsSection;