import React, { Component, useState } from 'react';
import styled from "styled-components";
import axios from 'axios';

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const TextForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogIn = async () => {
	  
	axios.get('http://localhost:5000/api/login') //this is catching errors instead of moving on even with correct console log
	  .then(response => {
		console.log(response.data);
		setIsLoggedIn(true);
      })
      .catch(error => {
        //console.error(error);
		setIsLoggedIn(true);
      });  
	/*  
    try {
	  await axios.get('http://localhost:5000/api/login');	
	
      const response = await axios.get('http://localhost:5000/api/login');
      console.log(response.data);  
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
	*/
  };
  
  const handleLogOut = async() => {
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
	    <a href="http://localhost:5000/api/login">
          <LogInButton onClick={handleLogIn}>Log In</LogInButton>
		</a>
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
        const response = await axios.post('http://localhost:5000/express_backend', inputs, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
        alert('error');
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

  return (
    <CenteredContainer>
      {isLoggedIn ? (
        <TextForm onSubmit={handleSubmit}>
          <label>
            Enter a URL to a Spotify playlist (required) ->
            <input type="text" name="playlist" value={inputs.playlist} onChange={handleInputChange} />
          </label>
          <label>
            Enter a keyword to rank songs by (not required) ->
            <input type="text" name="keyword" value={inputs.keyword} onChange={handleInputChange} />
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
    </CenteredContainer>
  );
}

/*
class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // GET route to OAuth
  callBackendAPI = async () => {
    const response = await fetch('http://localhost:5000/api/login');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    //return body;
	//alert("Express backend connected");
  };

  render() {
	  return (
	    <>
			<LogIn />
		</>
	);
  }
}
*/

function App() {
  return (
	<>
	  <LogIn />
	</>
  );
}
	  
export default App;
