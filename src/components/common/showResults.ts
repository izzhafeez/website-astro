import Swal from "sweetalert2";
import party from "party-js";
import toast from "./toast";

export const shareResults = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.fire({
    title: "Copied!",
    text: "Text copied to clipboard.",
    icon: "success",
  });
};

const showResults = (score: number, total: number, element: any, text: string) => {
  const pc = score / total;

  var imgSrc;
  if (pc == 1) {
    imgSrc = "perfect";
  } else if (pc > 0.95) {
    imgSrc = "fuiyoh";
  } else if (pc > 0.9) {
    imgSrc = "very-impressive";
  } else if (pc > 0.85) {
    imgSrc = "pretty-impressive";
  } else if (pc > 0.8) {
    imgSrc = "oh-wow";
  } else if (pc > 0.75) {
    imgSrc = "practice";
  } else if (pc > 0.7) {
    imgSrc = "you-fked-up";
  } else if (pc > 0.65) {
    imgSrc = "where-my-slipper";
  } else if (pc > 0.6) {
    imgSrc = "oh-no";
  } else if (pc > 0.55) {
    imgSrc = "are-you-serious";
  } else if (pc > 0.5) {
    imgSrc = "haiya";
  } else if (pc > 0.45) {
    imgSrc = "sacrilegious";
  } else if (pc > 0.4) {
    imgSrc = "so-weak";
  } else if (pc > 0.35) {
    imgSrc = "lamentable";
  } else if (pc > 0.3) {
    imgSrc = "what-da-hail";
  } else if (pc > 0.25) {
    imgSrc = "emotional-damage";
  } else if (pc > 0.2) {
    imgSrc = "terrible";
  } else if (pc > 0.15) {
    imgSrc = "send-u-to-jesus";
  } else if (pc > 0.1) {
    imgSrc = "low-iq";
  } else if (pc > 0.05) {
    imgSrc = "language-failure";
  } else {
    imgSrc = "failure";
  }

  if (score === total && element) {
    party.confetti(element);
  }

  Swal.fire({
    title: `Your Score: ${score}/${total}`,
    html: `<img src="/img/quizzes/${imgSrc}.gif"/>`,
    // button to copy text
    showCancelButton: true,
    cancelButtonText: "Close",
    confirmButtonText: "Share Results",
  }).then((result) => {
    if (result.isConfirmed) {
      navigator.clipboard.writeText(text);
      toast.fire({
        title: "Copied!",
        text: "Text copied to clipboard.",
        icon: "success",
      });
    }
  });
}

export default showResults;