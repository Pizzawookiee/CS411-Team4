//this script generates a degree of separation between the song title and keyword
//it takes in two arguments: keyword and song title. As long as keyword argument is first,
//no need to worry about song title having spaces

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




//ideas:
//if keyword appears immediately in filtered_input, return 0
//if no data, return -1 and break