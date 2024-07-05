import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";

function ConvoStarter({ id }: { id: string }) {
  const [questions, setQuestions] = useState([] as string[]);
  const [nextQuestion, setNextQuestion] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.PUBLIC_MM}/api/games/burning-bridges/${id}`).then(res => {
      setQuestions(res.data.questions);
      if (res.data.questions.length == 0) {
        Swal.fire({
          title: 'No Questions',
          text: 'There are no questions for this game. Please add some questions.',
          icon: 'info',
          confirmButtonText: 'Add Questions'
        }).then(() => {
          window.location.href = `${window.location.href}/create`;
        });
      }
    });
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '60px',
    className: 'center',
    beforeChange: (current: number, next: number) => {
      setNextQuestion(next);
    },
    afterChange: (current: number) => {
      setCurrentQuestion(current);
    }
  };

  const toLightUp = (index: number) => {
    return nextQuestion == index || currentQuestion == index;
  }

  return (
    <div className="max-w-sm lg:max-w-3xl mx-auto mt-40 text-white">
      <h1 className="text-6xl font-bold text-center">Burning Bridges</h1>
      {questions.length == 1 && <div className={`bg-ns-500 p-12 text-center rounded-3xl`}>
        <p>{questions[0]}</p>
      </div>}
      {questions.length >= 2 && <Slider {...settings}>
        {questions.map((question, index) => {
          return (
            <div key={index} className="p-4 perspective-1000 cursor-pointer">
              <div className={`transition delay-0 duration-500 ${ toLightUp(index) ? 'bg-ns-500' : 'bg-ns-700 opacity-50'} px-4 flex h-60 text-center rounded-3xl relative transform-style-3d transition-transform duration-700 transform text-white hover:rotate-y-180`}>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-0 grid content-center p-4">
                  Card {index + 1}<br/>
                  (Hover to flip)
                </div>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-180 grid content-center p-4">
                  {question}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>}
    </div>
  );
}

export default ConvoStarter;