import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import { HomeContext } from '../context/HomeContext';
import {PauseCircleFilled, PlayArrow} from '@material-ui/icons';
import styles from '../styles/Home.module.css'
import videos from '../data/videos';

export default function Home() {
  const {
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
  } = useContext (HomeContext);
  return (

    <div className={styles.main}>
      <div className={styles.video}>
      <video src={`video/${videoUrl}`} controls ref={videoRef} hidden></video>
     <canvas 
     className={styles.canvas}
     ref={canvasRef}
     width="760"
     height="440">
     </canvas>
     <div className={styles.controls}>
      <div className={styles.time}>
        <input
         type="range"
         min="0"
         max={totalTime}
         value={currentTime}
         onChange={(e) => configTime(Number(e.target.value))}
        />
       </div>
       <div className={styles.controlPainel}>
        <button className={styles.playButton} onClick={playPause}>
          {isPlaying ?
           (<PauseCircleFilled className={styles.playIcon} />): 
           (<PlayArrow className={styles.playIcon} />)
          }
        </button>
        <input
           type="range"
           min="0"
           max="1"
           step="0.01"
           value={volume}
           onChange={(e) => configVolume(Number(e.target.value))}
        />
      </div>  
       </div>
     </div>
     <div className={styles.listaVideo}>
         {
           videos.map((video, index) => {
            return (
              <div 
              className={styles.videoItem}
              onClick={(e) => configVideo(index)}
              >
                <img src={`capas/${video.capa}`} alt={video.title} />
                <h1>{video.title}</h1>
              </div>  
            )
           })
         }
     </div>
    </div>
  )
}
