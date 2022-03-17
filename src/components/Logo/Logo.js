import React from "react";
import Tilty from 'react-tilty';
import './logo.css';
import brain from './brain.png';


const Logo = () => {
    return (
        <div className="">
        <Tilty className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
          <div className="Tilt-inner pa3"> 
           <img style={{paddingTop: '5px'}} src={brain} alt="brain-icon" /> 
          </div>
        </Tilty>
        </div>
    )
}

export default Logo;