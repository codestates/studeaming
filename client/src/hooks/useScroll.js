import { useEffect, useState } from "react";

const useScroll = () => {
  const [isDown100, setisDown100] = useState(false);

  const updateScroll = () => {
    const { scrollY } = window;
    scrollY > 100 ? setisDown100(true) : setisDown100(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  return isDown100;
};

export default useScroll;
