import { useLottie } from "lottie-react";
import notfoundAnimation from "../../assets/animation/404.json";

const NotFoundPage = () => {
  const options = {
    animationData: notfoundAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 overflow-hidden">
      <div className="w-full h-full max-w-lg max-h-lg">{View}</div>
    </div>
  );
};

export default NotFoundPage;
