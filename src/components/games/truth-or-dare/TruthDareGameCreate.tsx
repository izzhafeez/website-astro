import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type Question = {
  truth: string;
  dare: string;
}

function TruthDareGameCreate({ id }: { id: string }) {
  // three inputs: purpose, information and quantity
  const [purpose, setPurpose] = useState('');
  const [information, setInformation] = useState('');
  const [quantity, setQuantity] = useState(3);
  const [truths, setTruths] = useState([] as string[]);
  const [dares, setDares] = useState([] as string[]);

  const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
  });

  useEffect(() => {
    axios.get(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}`).then(res => {
      setTruths(res.data.truths);
      setDares(res.data.dares);
    });
  }, []);

  const updateTruths = (value: string, index: number) => {
    const newTruths = [...truths];
    newTruths[index] = value;
    setTruths(newTruths);
  }

  const updateDares = (value: string, index: number) => {
    const newDares = [...dares];
    newDares[index] = value;
    setDares(newDares);
  }

  const saveQuestions = () => {
    toast.fire({
      icon: 'info',
      title: 'Saving Questions...'
    });
    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}/update`, {
      truths, dares
    }).then(() => {
      toast.fire({
        icon: 'success',
        title: 'Questions Saved!'
        });
      });
  }
   
  const deleteTruth = (index: number) => {
    const newTruths = [...truths];
    newTruths.splice(index, 1);
    setTruths(newTruths);
    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}/update`, {
      truths: newTruths,
      dares
    });
  }

  const deleteDare = (index: number) => {
    const newDares = [...dares];
    newDares.splice(index, 1);
    setDares(newDares);
    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}/update`, {
      truths,
      dares: newDares
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

    axios.post(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}/generate`, {
      purpose,
      information,
      quantity
    }).then(res => {
      setTruths(res.data.truths);
      setDares(res.data.dares);
      toast.fire({
        icon: 'success',
        title: 'Cards Generated!'
      });
    });
  };

  // floating form in the centre
  return (
    <div className="p-2 h-screen">
      <div className={`p-4 md:p-6 rounded-3xl shadow-md max-w-3xl ${truths.length + dares.length > 0 ? 'mt-4' : 'mt-40'} mx-auto bg-ew-500/50`}>
        <div className="text-left lg:text-center">
          <h1 className="text-white text-3xl lg:text-6xl font-extrabold my-4 inline-block">Truth or Dare</h1>
          <p className="max-w-3xl mb-4 text-white">Create a new Truth or Dare game by filling out the form below. We will take your preferences into account and give you a custom experience.</p>
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
              <label className="text-left font-bold min-w-10 text-white">Number of Players:</label>
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
          {truths.length > 0 && <div className="grid gap-2">
            <h2 className="text-white text-2xl font-extrabold mt-6">Generated Truths</h2>
            <div className="grid gap-2">
              {truths.map((truth, index) => (
                <div key={index} className="grid">
                  <label className="text-left font-bold min-w-10 text-white">Question {index + 1}:</label>
                  <div className="flex">
                    <input
                      name={`truth-${index}`}
                      value={truth}
                      onChange={e => updateTruths(e.target.value, index)}
                      className="bg-white text-black rounded-l-md px-2 w-full"/>
                    <button onClick={() => deleteTruth(index)} type="button" className="ms-auto w-40 p-2 rounded-r-md bg-ns-500 hover:opacity-80 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>}
          {dares.length > 0 && <div className="grid gap-2">
            <h2 className="text-white text-2xl font-extrabold mt-6">Generated Dares</h2>
            <div className="grid gap-2">
              {dares.map((dare, index) => (
                <div key={index} className="grid">
                  <label className="text-left font-bold min-w-10 text-white">Question {index + 1}:</label>
                  <div className="flex">
                    <input
                      name={`dare-${index}`}
                      value={dare}
                      onChange={e => updateDares(e.target.value, index)}
                      className="bg-white text-black rounded-l-md px-2 w-full"/>
                    <button onClick={() => deleteDare(index)} type="button" className="ms-auto w-40 p-2 rounded-r-md bg-ns-500 hover:opacity-80 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>}
          {truths.length + dares.length > 0 && <div className="flex">
              <button onClick={saveQuestions} type="button" className="w-40 mt-4 p-2 rounded-md text-white hover:opacity-80 bg-dt-500">Save</button>
              <button onClick={() => {
                const new_link = window.location.href.split('/');
                new_link.pop();
                window.location.href = new_link.join('/');
              }} type="button" className="ms-auto w-40 mt-4 p-2 rounded-md bg-ew-500 hover:opacity-80 text-white">Start</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default TruthDareGameCreate;