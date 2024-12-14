import React from "react";
import Swal from "sweetalert2";
import StarScale from "./StarScale";

type CommentEditorProps = {
  id: string;
  refreshComments: () => void;
  color: string;
  fields?: any[];
  label: string;
};

export default function CommentEditor({ id, refreshComments, color, fields=[], label }: CommentEditorProps) {
  const [value, setValue] = React.useState("");
  const [name, setName] = React.useState("Anonymous");
  // based on fields, default 3
  const [ratingValues, setRatingValues] = React.useState({} as {[key: string]: number});

  React.useEffect(() => {
    const ratingValues = {} as {[key: string]: number};
    fields.forEach((field) => {
      const title = field.title as string;
      ratingValues[title] = 3;
    });
    setRatingValues(ratingValues);
  }, [fields]);

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleSubmit = () => {
    toast.fire({
      icon: "info",
      title: "Adding comment..."
    })
    const MM = import.meta.env.PUBLIC_MM;
    handleRate(MM);
  }

  const handleComment = (MM: string) => {
    const url = `${MM}/api/comments`;
    const payload = {
      key: id,
      poster: name,
      content: value,
      data: ratingValues,
      datetime: new Date().toISOString(),
      is_edit: fields.length > 0,
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
        toast.fire({
          icon: "success",
          title: "Comment added!"
        });
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

  const handleRate = (MM: string) => {
    const ratingUrl = `${MM}/api/rate`;
    const ratingPayload = {
      name,
      key: id,
      data: ratingValues,
      fields: fields.map((field) => field.title),
    }
    fetch(ratingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingPayload),
    })
      .then((response) => response.json())
      .then((data) => {
        handleComment(MM);
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
          Commenting as <span className={`text-${color}-500`}>{name}</span> (<button className={`underline hover:text-${color}-500`} onClick={handleNameChange}>Change?</button>)
        </div>

        {fields.length > 0 && fields.map((field, index) => (
          <div key={index} className="my-2 flex gap-2">
            <label className={`w-24`}>{field.title}</label>
            <StarScale value={ratingValues[field.title]} hook={(value) => {
              const newRatingValues = { ...ratingValues };
              newRatingValues[field.title] = value;
              setRatingValues(newRatingValues);
            }} />
          </div>
        ))}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Write ${fields.length > 0 ? 'an optional' : 'a'} comment...`}
          className={`w-full p-2 border-2 bg-transparent focus:border-${color}-500 rounded-md my-2`}
        />
      </div>
      <button className='bg-ew-500 p-2 rounded-lg hover:bg-ew-300 text-white' onClick={handleSubmit}>Add {label}</button>
    </div>
  );
}