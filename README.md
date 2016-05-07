# Carlton (Company Space)
Carlton becomes the "Company Space"-backend REST-service for Geoffrey.
The idea is to clearly separate the company backend as an individual microservice, in order to
improve scalability and maintainability of that part of our system.
Currently only `terms` are handled with the service (`viz` is next to come).

## Installation & Set Up
* Clone/fetch/pull the current version of the repository and run `npm install`.
* Grab the `.env.stormpath` file from our shared google docs folder and drop it into the project's root folder.
* Grab the `.env.cge` file from our shared google docs folder and drop it into the project's
root folder.
* Check if your `development.json` is properly set up (compare it to the one in our google docs folder).
* Make sure you have mongo running on your machinge, e.g. with a statment like `mongod --dbpath="path/to/data/directory"`
* That's it, run `node app` in your project and enjoy.

## Current Rest Endpoints
* GET /company/terms
* POST /company/terms
* PUT /company/terms/\<SomeExistingTerm>
* DELETE /company/terms/\<SomeExistingTerm>

## Authorization
Since both, Geoffrey and Carlton use Stormpath for authentication, we do not need to set up
or implemented any exhausting authentication on our own and can use it right away.

## The terms API
The terms API is implemented as a REST service.
If you would like to use the terms API to list the terms, add a new term, alter a term or delete a term
then you can currently **use the web-browser's console** to fire some ajax requests, when you're on a
Geoffrey site (I've set up jQuery on the front-end so that we can use that).
Be aware that parameter and error handling is rather poor since it's not a goal of the project.
Either you get as server response a json-object with a `terms` property that contains the updated list of terms
of the current user, or (in case something went wrong on the backend) you get an `err` property with a hopefully
understandable error-message.

### Check whether carlton is online
```javascript
$.ajax({
	url: 'http://104.196.103.90:3001/carlton/dev/online',
	type: 'get',
	dataType: 'json',
	cache: false,
	success: function( res ) {
		console.log('Response from server = ', res);
	},
    error: function( xhr, status, errorThrown ) {
        console.log('AJAX ERROR: xhr = ', xhr);
        console.log('AJAX ERROR: status = ', status);
        console.log('AJAX ERROR: errorThrown = ', errorThrown);
    }
});
```

### Create a new term
```javascript
$.ajax({
	url: 'http://104.196.103.90:3001/carlton/company/terms',
	type: 'post',
	data: { 'term': 'BatmanVSSuperman' },
	dataType: 'json',
	cache: false,
	success: function( res ) {
		console.log('Response from server = ', res);
	},
    error: function( xhr, status, errorThrown ) {
        console.log('AJAX ERROR: xhr = ', xhr);
        console.log('AJAX ERROR: status = ', status);
        console.log('AJAX ERROR: errorThrown = ', errorThrown);
    }
});
```

### List the terms
```javascript
$.ajax({
	url: 'http://104.196.103.90:3001/carlton/company/terms',
	type: 'get',
	dataType: 'json',
	cache: false,
	success: function( res ) {
		console.log('Response from server = ', res);
	},
    error: function( xhr, status, errorThrown ) {
        console.log('AJAX ERROR: xhr = ', xhr);
        console.log('AJAX ERROR: status = ', status);
        console.log('AJAX ERROR: errorThrown = ', errorThrown);
    }
});
```

### Update a term
```javascript
$.ajax({
	url: 'http://104.196.103.90:3001/carlton/company/terms/BatmanVSSuperman',
	type: 'put',
	data: { 'newTerm': 'IronMan' },
	dataType: 'json',
	cache: false,
	success: function( res ) {
		console.log('Response from server = ', res);
	},
    error: function( xhr, status, errorThrown ) {
        console.log('AJAX ERROR: xhr = ', xhr);
        console.log('AJAX ERROR: status = ', status);
        console.log('AJAX ERROR: errorThrown = ', errorThrown);
    }
});
```

### Delete a term
```javascript
$.ajax({
	url: 'http://104.196.103.90:3001/carlton/company/terms/IronMan',
	type: 'delete',
	dataType: 'json',
	cache: false,
	success: function( res ) {
		console.log('Response from server = ', res);
	},
    error: function( xhr, status, errorThrown ) {
        console.log('AJAX ERROR: xhr = ', xhr);
        console.log('AJAX ERROR: status = ', status);
        console.log('AJAX ERROR: errorThrown = ', errorThrown);
    }
});
```
