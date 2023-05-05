//something anything
import React, { Component, useState } from 'react';
import styled from "styled-components";
import axios from 'axios';
import Cookies from 'js-cookie';


function Instructions({ isLoggedIn }) {
  return (
    <div style={{position: 'fixed', bottom: 10, right: 10, backgroundColor: 'lightgoldenrodyellow', border: '2px solid white', padding: '10px',}}>
      <div style={{ color: 'black' }}>
=====================================
        {isLoggedIn ? (
          <p>
            1. Copy and paste Spotify playlist link into white textbox <br />
            2. Click Submit <br />
            3. Wait 20-30 seconds <br />
            4. Inspect your findings
          </p>
        ) 
        : (
          <p>Click Login to start using the app.</p>
        )}
  ======================================
      </div>
    </div>
  );
}

// Define the background image
const BackgroundImage = styled.div`
  background-image: url('/path/to/background/image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
`;

// Define the text box for instructions
const TextBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
`;

// Define the title
const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  color: #ffffff;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("cat.jpg");
  background-size: cover;
`;

const RandomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://picsum.photos/4000/2500");
  background-size: cover;
`;

const TextForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    color: white;
  }
`;

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
  display: block;
`;

const LogInButton = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
  position: fixed;
  top: 10px;
  right: 10px;
`;


const WarningText = styled.p`
  color: red;
`;



function LogIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');

  const handleLogIn = async () => {
	//this block doesn't work for some reason  
	/*
    try {	
      const response = await axios.get('http://localhost:8888/login');
      console.log(response.data);  
      Cookies.set('isLoggedIn', true);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
	*/
	
	Cookies.set('isLoggedIn', true);
    
  };
  
//  const token = Cookies.get('token');
//  alert(token);
  
  const handleLogOut = async() => {
    Cookies.remove('isLoggedIn');
    setIsLoggedIn(false);
  };



  return (
    <div>
      {isLoggedIn ? (
	    <>

			<MyForm isLoggedIn={isLoggedIn} />
			<LogInButton onClick={handleLogOut}>Log Out</LogInButton>

		</>
      ) : (
	  /*
	  <LogInButton onClick={handleLogIn}>Log In</LogInButton>
	  */
    <>
      <CenteredContainer>
        <h1> Please log in with your Spotify account</h1>
	      <a href="http://localhost:8888/login">
           <LogInButton onClick={handleLogIn}>Log In</LogInButton>
           
		  </a>
      </CenteredContainer>
    </>
	  )}
    </div>
  );
}



function MyForm({ isLoggedIn }) {
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialInputs = {
    playlist: '',
    keyword: '',
  };
  const [inputs, setInputs] = useState(initialInputs);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputs.playlist === '') {
      setShowWarning(true);
    } else {
      setIsSubmitting(true);
      try {
			
		const response = await axios.post(
		  'http://localhost:8888/related_terms',
		  { 
			playlist: inputs.playlist, 
			keyword: ''
		  }
		);

		alert(JSON.stringify(response.data))
		    console.log(response.data);
      } catch (error) {
        console.error(error);
        alert('Error: Please check to make sure you are entering a valid spotify URL link');
      }
      setShowWarning(false);
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleReset = () => {
    setInputs(initialInputs);
    setShowWarning(false);
  };

  const [curBackground, setCurBackground] = useState(0);

  const handleChange = () => {
    setCurBackground(curBackground + 1);
  };


  const RandomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("hhttps://picsum.photos/4000/2500?random=${curBackground}");
  background-size: cover;
`;


  return (
    <div style={{ backgroundImage: `url(https://picsum.photos/4000/2500?random=${curBackground})`, backgroundSize: "cover" }}>
      {/* ... */}
      <Button onClick={handleChange}>Change Background</Button>
      {isLoggedIn && <Instructions isLoggedIn={isLoggedIn} />}
      {isLoggedIn ? (
        <TextForm onSubmit={handleSubmit}>
          <label>
            Enter a URL to a Spotify playlist (required) ->
            <input type="text" name="playlist" value={inputs.playlist} onChange={handleInputChange} />
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.5 : 1 }}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            {showWarning && <WarningText>Please enter a playlist URL</WarningText>}
          </div>
        </TextForm>
      ) : (
        <div>Please log in to Spotify to use this app.</div>
      )}
    </div>
  );
}

//DEPRECATED code for keyword field 
/*
<label>
            Enter a keyword (not required) ->
            <input type="text" name="keyword" value={inputs.keyword} onChange={handleInputChange} />
          </label>
*/        







function App() {
  return (
  <div>
    <p>
      CS411 Section A2 Team 4: David Lee, Sean Lin, Taha Dawood 
    </p>
        <LogIn />

  </div>
  );
}


	  
export default App;

