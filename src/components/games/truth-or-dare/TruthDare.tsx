import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Swal from "sweetalert2";

function TruthDare({ id }: { id: string }) {
  const [truths, setTruths] = useState([] as string[]);
  const [dares, setDares] = useState([] as string[]);
  const [truthsIndex, setTruthsIndex] = useState(0);
  const [daresIndex, setDaresIndex] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.PUBLIC_MM}/api/games/truth-or-dare/${id}`).then(res => {
      setTruths(res.data.truths);
      setDares(res.data.dares);
      if (res.data.truths.length == 0) {
        Swal.fire({
          title: 'No Truths Found',
          text: 'You need to add some truths before you can play the game.',
          icon: 'info',
          confirmButtonText: 'Add Truths'
        }).then(() => {
          window.location.href = `${window.location.href}/create`;
        });
        return;
      }

      if (res.data.dares.length == 0) {
        Swal.fire({
          title: 'No Dares Found',
          text: 'You need to add some dares before you can play the game.',
          icon: 'info',
          confirmButtonText: 'Add Dares'
        }).then(() => {
          window.location.href = `${window.location.href}/create`;
        });
        return;
      }
    });
  }, []);

  const truthSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '60px',
    className: 'center',
    beforeChange: (current: number, next: number) => {
      setTruthsIndex(next);
    }
  };

  const dareSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '60px',
    className: 'center',
    beforeChange: (current: number, next: number) => {
      setDaresIndex(next);
    }
  };

  return (
    <div className="max-w-sm lg:max-w-3xl mx-auto text-white">
      <h1 className="text-6xl font-bold text-center">Truth...</h1>
      {truths.length == 1 && <div className={`bg-ew-500 p-12 text-center rounded-3xl`}>
        <p>{truths[0]}</p>
      </div>}
      {truths.length >= 2 && <Slider {...truthSettings}>
        {truths.map((truth, index) => {
          return (
            <div key={index} className="p-4 perspective-1000 cursor-pointer">
              <div className={`transition delay-0 duration-500 ${ index == truthsIndex ? 'bg-ew-500' : 'bg-ew-700 opacity-50'} px-4 flex h-60 text-center rounded-3xl relative transform-style-3d transition-transform duration-700 transform text-white hover:rotate-y-180`}>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-0 grid content-center p-4">
                  Truth {index + 1}<br/>
                  (Hover to flip)
                </div>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-180 grid content-center p-4">
                  {truth}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>}
      <h1 className="text-6xl font-bold text-center">...or Dare</h1>
      {dares.length >= 2 && <Slider {...dareSettings}>
        {dares.map((dare, index) => {
          return (
            <div key={index} className="p-4 perspective-1000 cursor-pointer">
              <div className={`transition delay-0 duration-500 ${ index == daresIndex ? 'bg-ew-500' : 'bg-ew-700 opacity-50'} px-4 flex h-60 text-center rounded-3xl relative transform-style-3d transition-transform duration-700 transform text-white hover:rotate-y-180`}>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-0 grid content-center p-4">
                  Dare {index + 1}<br/>
                  (Hover to flip)
                </div>
                <div className="backface-hidden absolute w-full h-full inset-0 rotate-y-180 grid content-center p-4">
                  {dare}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>}
    </div>
  );
}

export default TruthDare;