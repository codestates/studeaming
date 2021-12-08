import { useEffect, useState } from "react";

const useAudio = (sounds) => {
  const [sources] = useState(
    sounds.map((ASMR) => {
      return {
        url: ASMR.url,
        audio: new Audio(ASMR.url),
      };
    })
  );

  const [players, setPlayers] = useState(
    sounds.map((ASMR) => {
      return {
        ...ASMR,
        playing: false,
      };
    })
  );

  const toggle = (targetIndex) => {
    const newPlayers = [...players];
    const currentIndex = players.findIndex((p) => p.playing === true);
    if (currentIndex !== -1 && currentIndex !== targetIndex) {
      newPlayers[currentIndex].playing = false;
      newPlayers[targetIndex].playing = true;
    } else if (currentIndex !== -1) {
      newPlayers[targetIndex].playing = false;
    } else {
      newPlayers[targetIndex].playing = true;
    }
    setPlayers(newPlayers);
  };

  useEffect(() => {
    sources.forEach((source, i) => {
      players[i].playing ? source.audio.play() : source.audio.pause();
    });
  }, [sources, players]);

  useEffect(() => {
    sources.forEach((source, i) => {
      source.audio.addEventListener("ended", () => {
        const newPlayers = [...players];
        newPlayers[i].playing = false;
        setPlayers(newPlayers);
      });
    });

    return () => {
      sources.forEach((source, i) => {
        source.audio.removeEventListener("ended", () => {
          const newPlayers = [...players];
          newPlayers[i].playing = false;
          setPlayers(newPlayers);
        });
      });
    };
  }, []);

  return [players, toggle];
};

export default useAudio;
