import { useLottie } from "lottie-react";
import errorAnimation from "@/assets/animation/Error.json";

const ErrorPage = () => {
  const options = {
    animationData: errorAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <div className="w-full h-full max-w-lg max-h-lg">{View}</div>
    </div>
  );
};

export default ErrorPage;
