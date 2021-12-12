import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-400",
  "from-red-400",
  "from-blue-400",
  "from-green-400",
  "from-yellow-400",
  "from-pink-400",
  "from-purple-400",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  // console.log(color);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("something went wrong", err));
  }, [spotifyApi, playlistId]);


  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className={`flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80
        cursor-pointer rounded-full p-1 pr-2 border-2 `}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt="user_image"
          />
          <h2 className="pr-2">{session?.user.name}</h2>
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b  to-black ${color} h-80
      text-white p-8 `}
      >
        <img
          src={playlist?.images?.[0]?.url}
          alt="playlistLogo"
          className="w-44 h-44 shadow-2xl"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
