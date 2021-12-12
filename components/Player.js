import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"
import { HeartIcon,
VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon,

} from '@heroicons/react/solid'
import {debounce} from 'lodash'



function Player() {

    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlayling, setIsPlaying] =useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    // To fetch data when we refresh the page and a song is playing 
    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }


    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => 
        {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume);
        }, 200),
        []
    )

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId) {
            // I want to fetch the song ingo 
        fetchCurrentSong();
        setVolume(50);

        }
    },[currentTrackId, spotifyApi, session]);

    useEffect(() => {
        if(volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    console.log("volume" + volume);

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8 ">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon className='button'
                //As of now, the API isn't working but
                //onClick={() => spotifyApi.skipToPrevious()}
                />

            {isPlayling ? 
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/> :
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/> }

            <FastForwardIcon className="button"
            //As of now, the API isn't working but
                //onClick={() => spotifyApi.skipToNext()}
                />
            <ReplyIcon className="button"/>
            </div>
            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume - 10)}/>
                <input className="w-14 md:w-28" type="range" min={-1} max={101} value={volume} 
                onChange={e => setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon className="button" 
                onClick={() => volume < 100 && setVolume(volume + 10)}/>
            </div>

        </div>
    )
}

export default Player
