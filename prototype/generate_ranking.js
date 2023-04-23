//DEPRECATED due to abandonment of song ranking functionality

//this script generates a degree of separation between the song title and keyword
//it takes in two arguments: keyword and song title. As long as keyword argument is first,
//no need to worry about song title having spaces

const { exec } = require('child_process');

let mergedArgs = '';
for (let i = 3; i < process.argv.length; i++) {
  mergedArgs += process.argv[i];
  if (i < process.argv.length-1) {
	  mergedArgs += '+'; //merge with plus sign, otherwise the call doesn't work
  }
}

const filterString = (str) => {
  // Convert any uppercase characters to lowercase
  const lowercaseStr = str.toLowerCase();
  
  // Remove any non-lowercase characters or spaces
  const filteredStr = lowercaseStr.replace(/[^a-z ]/g, '');

  return filteredStr;
};

const keyword = process.argv[2].toLowerCase(); //keyword in lowercase

const filtered_input = filterString(mergedArgs);

if(filtered_input.includes(keyword)) {
	console.log('keyword in song title');
	return 0;	
}

let temp_trends_output = '';

exec(`node get_related_terms_for_one_term.js ${keyword} ${filtered_input}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  //console.log(`stdout: ${stdout}`);
  //console.error(`stderr: ${stderr}`);
  if (stdout.includes(keyword)) {
	  console.log('degree of separation is 1');
	  //return 1;
  }
  temp_trends_output = stdout;
  //console.log(typeof stdout);
  console.log(temp_trends_output); 
  check_one_degree(temp_trends_output);
  //console.log(typeof str);
  //const arr = str.replace(/[{}]/g, '').split(',').map(str => str.trim());
  //console.log(arr);
});

function check_one_degree(input_string) {
	//inputs_array = input_string.split(',');
	let inputs = "{" + input_string + "}";
	inputs = inputs.replace(/\s+/g, "+");
	
	
	exec(`node get_related_terms.js ${inputs}`, (error, stdout, stderr) => {
	  if (error) {
		console.error(`exec error: ${error}`);
		return;
	  }
	  //console.log(`stdout: ${stdout}`);
	  //console.error(`stderr: ${stderr}`);
	  if (stdout.includes(keyword)) {
		  console.log('degree of separation is 1');
		  //return 1;
	  }
	  temp_trends_output = stdout;
	  //console.log(typeof stdout);
	  console.log(temp_trends_output); 
	  //check_one_degree(temp_trends_output);
	  //console.log(typeof str);
	  //const arr = str.replace(/[{}]/g, '').split(',').map(str => str.trim());
	  //console.log(arr);
	});
	
};


//ideas:
//if keyword appears immediately in filtered_input, return 0
//if no data, return -1 and break