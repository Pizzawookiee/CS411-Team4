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

const WarningText = styled.p`
  color: red;
`;

function MyForm() {
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialInputs = {
    playlist: '',
    keyword: '',
  };

  const [inputs, setInputs] = useState(initialInputs);
  
  //const [playlist, p_setInputs] = useState("");
  //const [keyword, k_setInputs] = useState("");

  const handleSubmit = async(event) => {
	//note: disable submit button until await finishes
    event.preventDefault();
    if (inputs.playlist === '') {
      setShowWarning(true);
    } else {
	  setIsSubmitting(true); //this disables the submit button	
	  try {
        const response = await axios.post('http://localhost:5000/express_backend', inputs);
        console.log(response.data);
		//alert('${response}')
      } catch (error) {
        console.error(error);
		alert('error')
      }
	  setShowWarning(false);
	  setIsSubmitting(false); //re-enables button
      //console.log(inputs.playlist);
      //alert(`submitted ${inputs.playlist}, ${inputs.keyword}`);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleReset = () => {
	setInputs(initialInputs);
    //p_setInputs('');
    //k_setInputs('');
    setShowWarning(false);
  };

  return (
    <CenteredContainer>
      <TextForm onSubmit={handleSubmit}>
        <label>Enter a URL to a Spotify playlist (required) ->
          <input
            type="text"
			name="playlist"
            value={inputs.playlist}
            onChange={handleInputChange}
          />
        </label>
        <label>Enter a keyword to rank songs by (not required) ->
          <input
            type="text"
			name="keyword"
            value={inputs.keyword}
            onChange={handleInputChange}
          />
        </label>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}  style={{ opacity: isSubmitting ? 0.5 : 1 }}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
		  {showWarning && <WarningText>Please enter a playlist URL</WarningText>}
        </div>
      </TextForm>

    </CenteredContainer>
  )
}

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    //return body;
	//alert("Express backend connected");
  };

  render() {
	  return (
		<MyForm />
	);
  }
}

	  
export default App;
