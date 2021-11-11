import { createContext, MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import videos from '../data/videos';

type HomeContextData = {
    videoUrl: string;
    isPlaying: boolean;
    videoRef: MutableRefObject<HTMLVideoElement>;
    canvasRef: MutableRefObject<HTMLCanvasElement>; 
    currentTime:number;
    totalTime: number;
    volume: number;
    playPause: () => void;
    configTime: (time: number) => void;
    configVideo: (videoIndex: number) => void; 
    configVolume: (volume: number) => void;
}

type HomeContextProviderProps = {
    children: ReactNode;
}    

export const HomeContext = createContext ({} as HomeContextData);

const HomeContextProvider = ({children}:HomeContextProviderProps) => {
    const [videoUrl, setVideoUrl] = useState ("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [videoIndex, setVideoIndex] = useState(1);
    const [volume, setVolume] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
       configVideo(videoIndex);
    });
    
    useEffect(() => {
       if (videoUrl && videoUrl.length > 0){
            const video = videoRef.current;

            video.onloadedmetadata = () => {
               setTotalTime(video.duration); 

               if(isPlaying){
                   video.play();
                   draw();
               }
            }

            video.ontimeupdate = () => {
                setCurrentTime(video.currentTime);
            }

            video.onended = () => {
              configVideo(videoIndex + 1);
            }
       }
    }, [videoUrl, currentTime]);

    const configVideo = (index: number) => {
        const nextIndex = index % videos.length;
        const nextVideoUrl = videos[nextIndex].video;        
        setVideoIndex(nextIndex);
        setVideoUrl(nextVideoUrl);
    }   

    const configTime = (time: number) => {
        const video = videoRef.current;
        video.currentTime = time;
        setCurrentTime(time);
    }

    const configVolume = (volume: number) => {
        const video = videoRef.current;
        setVolume(volume);
        video.volume = volume;
    }

    const draw = () => {
        const video = videoRef.current;
        if(video.paused || video.ended) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.drawImage(video, 0, 0, 760, 440);

        requestAnimationFrame(draw);
    }

    const playPause = () => {
        const video = videoRef.current;
        if (isPlaying) {
          video.pause();
        }
        else {
          video.play();
          draw();
        }
        setIsPlaying(!isPlaying);
    }

    return (
        <HomeContext.Provider value={
              {
                  videoUrl,
                  isPlaying,
                  videoRef,
                  canvasRef,
                  currentTime,
                  totalTime,
                  volume,
                  playPause,
                  configTime,
                  configVideo,
                  configVolume
              }
        }>
            {children}
         </HomeContext.Provider>   
    )
}

export default HomeContextProvider;