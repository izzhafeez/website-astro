import React from "react";
import Swal from "sweetalert2";

export default function CommentEditor({ id, refreshComments }: { id: string, refreshComments: () => void }) {
  const [value, setValue] = React.useState("");
  const [name, setName] = React.useState("Anonymous");

  const handleSubmit = () => {
    const MM = import.meta.env.PUBLIC_MM;
    const url = `${MM}/api/comments`;
    const payload = {
      key: id,
      poster: name,
      content: value,
      datetime: new Date().toISOString(),
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const commentId = data.id;
        setValue("");
        // add the id of the added comment to localStorage
        const addedComments = localStorage.getItem("comments-added");
        if (addedComments) {
          const addedCommentsArray = addedComments.split(",");
          addedCommentsArray.push(commentId);
          localStorage.setItem("comments-added", addedCommentsArray.join(","));
        } else {
          localStorage.setItem("comments-added", commentId);
        }
        refreshComments();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleNameChange = () => {
    Swal.fire({
      title: 'Enter your name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        setName(name);
        // set name in localStorage
        localStorage.setItem('comments-name', name);
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  // retrieve name from localStorage
  React.useEffect(() => {
    const name = localStorage.getItem('comments-name');
    if (name) {
      setName(name);
    }
  }, []);

  return (
    <div className="">
      <div className="grid my-2">
        <div>
          Commenting as <span className='text-cc-mrt'>{name}</span> (<button className='underline hover:text-cc-mrt' onClick={handleNameChange}>Change?</button>)
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border-2 bg-transparent focus:border-cc-500 rounded-md my-2"
        />
      </div>
      <button className='bg-ew-500 p-2 rounded-lg hover:bg-ew-300 text-white' onClick={handleSubmit}>Add Comment</button>
    </div>
  );
}