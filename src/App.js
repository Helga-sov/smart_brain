import React, {Component} from "react";
import './App.css';
import 'tachyons';
import Particles from "react-tsparticles";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const particlesInit = (main) => {
  console.log(main);
};

const particlesLoaded = (container) => {
  console.log(container);
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
}
}

class App extends Component {
  constructor(props) {
  super(props)
  this.state = initialState;
  }

loadUser = (data) => {
  this.setState({user: {
    id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
  }})
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onPictureSubmit = () => {
  this.setState({imageUrl: this.state.input})
  fetch('https://tranquil-reaches-44915.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            input: this.state.input
        })
      })
      .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://tranquil-reaches-44915.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
    .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
    <Particles className="particles"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }}
    />
     <Navigation 
       onRouteChange={this.onRouteChange}
       isSignedIn={isSignedIn}
     />
     { this.state.route === 'home'
     ? <div>
     <Logo />
     <Rank 
       name={this.state.user.name}
       entries={this.state.user.entries}
     />
      <ImageLinkForm 
        onInputChange={this.onInputChange}
        onPictureSubmit={this.onPictureSubmit}
      />
     <FaceRecognition 
     box={box} 
     imageUrl={imageUrl} /> 
     </div>
     : (
       route === 'signin'
        ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
     )
     }
    </div>
  );
}
}

export default App;
