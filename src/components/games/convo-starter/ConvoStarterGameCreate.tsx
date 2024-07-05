import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function ConvoStarterGameCreate({ id }: { id: string }) {
  // three inputs: purpose, information and quantity
  const [purpose, setPurpose] = useState('');
  const [information, setInformation] = useState('');
  const [quantity, setQuantity] = useState(3);
  const [questions, setQuestions] = useState([] as string[]);

  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
  });

  useEffect(() => {
    axios.get(`${import.meta.env.PUBLIC_MM}/api/games/convo-starter/${id}`).then(res => {
      setQuestions(res.data.questions);
    });
  }, []);

  const updateQuestions = (value: string, index: number) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  }

  const saveQuestions = () => {
    toast.fire({
      icon: 'info',
      title: 'Saving Questions...'
    });
    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/convo-starter/${id}/update`, {
      questions
    }).then(() => {
      toast.fire({
        icon: 'success',
        title: 'Questions Saved!'
        });
      });
  }
   
  const deleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/convo-starter/${id}/update`, {
      questions: newQuestions
    });
  }

  const onGenerate = () => {
    if (purpose === '') {
      Swal.fire('Purpose is required', 'Please enter a purpose for the game.', 'error');
      return;
    }

    if (information === '') {
      Swal.fire('Participant Description is required', "Please describe who the participants are.", 'error');
      return;
    }

    if (quantity < 1) {
      Swal.fire('Quantity is required', 'Please enter a valid quantity for the game.', 'error');
      return;
    }

    if (quantity > 10) {
      Swal.fire('Quantity is too high', 'Please enter a quantity less than 10.', 'error');
      return;
    }

    toast.fire({
      icon: 'info',
      title: 'Generating Cards...'
    });

    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/convo-starter/${id}/generate`, {
      purpose,
      information,
      quantity
    }).then(res => {
      setQuestions(res.data.questions);
      toast.fire({
        icon: 'success',
        title: 'Cards Generated!'
      });
    });
  };

  // floating form in the centre
  return (
    <div className="p-2 h-screen">
      <div className={`p-4 md:p-6 rounded-3xl shadow-md max-w-3xl ${questions.length > 0 ? 'mt-4' : 'mt-40'} mx-auto bg-dt-500/50`}>
        <div className="text-left lg:text-center">
          <h1 className="text-white text-3xl lg:text-6xl font-extrabold my-4 inline-block">Convo Starter</h1>
          <p className="max-w-3xl mb-4 text-white">Create a new Convo Starter game by filling out the form below. We will take your preferences into account and give you a custom experience.</p>
          <div className="grid gap-2">
            <div className="grid">
              <label className="text-left font-bold min-w-10 text-white">Purpose:</label>
              <textarea
                name="purpose"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder='e.g. Social networking event for Freshmen...'
                className="transition duration-500 bg-white text-black rounded-md"/>
            </div>
            <div className="grid">
              <label className="text-left font-bold min-w-10 text-white">Participant Description:</label>
              <textarea
                name="information"
                value={information}
                onChange={e => setInformation(e.target.value)}
                placeholder='e.g. People who like learning and meeting new people...'
                className="transition duration-500 bg-white text-black rounded-md"/>
            </div>
            <div className="grid">
              <label className="text-left font-bold min-w-10 text-white">Quantity:</label>
              <input
                name="quantity"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number.parseInt(e.target.value))}
                placeholder='Enter Quantity...'
                className="transition duration-500 bg-white text-black rounded-md"/>
            </div>
            <button onClick={onGenerate} type="button" className="ms-auto w-40 mt-4 p-2 rounded-md bg-cc-500 dark:bg-dt-200 hover:opacity-80 text-white">Generate Cards</button>
          </div>
          {questions.length > 0 && <div className="grid gap-2">
            <h2 className="text-white text-2xl font-extrabold my-4">Generated Cards</h2>
            <div className="grid gap-2">
              {questions.map((question, index) => (
                <div key={index} className="grid">
                  <label className="text-left font-bold min-w-10">Question {index + 1}:</label>
                  <div className="flex">
                    <input
                      name={`question-${index}`}
                      value={question}
                      onChange={e => updateQuestions(e.target.value, index)}
                      className="bg-white text-black rounded-l-md px-2 w-full"/>
                    <button onClick={() => deleteQuestion(index)} type="button" className="ms-auto w-40 p-2 rounded-r-md bg-ns-500 hover:opacity-80 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex">
              <button onClick={saveQuestions} type="button" className="w-40 mt-4 p-2 rounded-md text-dt-700 hover:opacity-80 bg-white">Save</button>
              <button onClick={() => {
                const new_link = window.location.href.split('/');
                new_link.pop();
                window.location.href = new_link.join('/');
              }} type="button" className="ms-auto w-40 mt-4 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Start</button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default ConvoStarterGameCreate;