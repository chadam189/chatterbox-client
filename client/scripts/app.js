// these two are default variables used for cleaning the PARSE database of xss attacks
// var badIDs = [];
// var weirdInputsIDs = [];

var app = {
  
  defaultMessage: {
    username: 'MaxAndChadam',
    text: 'what\'s up 83s',
    roomname: '83...youBestBelieve'
  },
  defaultSuccessCB: function (data) { console.log('chatterbox: Message sent'); },
  defaultErrorCB: function (data) { console.error('chatterbox: Failed to send message'); },

  'send': function(message = this.defaultMessage, successCB = this.defaultSuccessCB) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      
      data: JSON.stringify(message),
      contentType: 'application/json',
      
      success: successCB,
      error: this.defaultErrorCB
    });
  },
  
  'fetch': function(obj = {order: '-createdAt', limit: 100}, successCB = this.defaultSuccessCB, errorCB = this.defaultErrorCB) {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: obj,
      contentType: 'json',
      success: successCB,
      error: errorCB
    });
  },
  
  'clearMessages': function() {
    var tweetsToDelete = document.getElementsByClassName('singleTweet');
    while (tweetsToDelete[0]) {
      tweetsToDelete[0].parentNode.removeChild(tweetsToDelete[0]);
    }
  },
  
  'renderMessage': function(tweet) {
    var $tweet = $('<div class="singleTweet"></div>');
    var $tweetUser = $('<h3 class="username" class="' + JSON.stringify(tweet.username) + '"></h3>').text(tweet.username);
    var $tweetText = $('<p class="tweetMessage"></p>').text(tweet.text);
    $tweet.append($tweetUser);
    $tweet.append($tweetText);
    $('#chats').append($tweet);
  },
  
  'renderRoom': function() {
    
    // find the room name that's selected
    let newRoom = document.getElementById('roomForm').value;
    
    // filter for tweets that meet the requested room name
    let roomFilter = {
      order: '-createdAt', 
      // where: {roomname: newRoom},
      limit: 1000
    };
    
    // leave the existing room list, but clear messages from the chat box
    // then repost the relevant messages
    
    let successfulCB = function (data) {
      app.chatHistory = data;
      app.clearMessages();
      
      // find out new room counts
      app.roomsByPopularity = {};
      app.roomsList = [];
      
      app.chatHistory.results.forEach(tweet => {
        app.roomsByPopularity[tweet.roomname] = app.roomsByPopularity[tweet.roomname] + 1 || 1;
      });
      
      for (let key in app.roomsByPopularity) {
        app.roomsList.push(key);
      }
      
      app.roomsList.push(app.defaultRoom);
      app.roomsByPopularity[app.defaultRoom] = app.chatHistory.results;
      
      // put rooms in the dropdown list alphabetically
      app.roomsList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      app.roomCount = 0;
      
      let newRoomName = document.getElementById('roomForm').value;
      
      $('#mySelect').empty();
      
      $('#roomForm').empty();
      for (let room of app.roomsList) {
        // populate rooms list with all rooms that have at least one messsage
        app.roomCount++;
        console.log(typeof room);
        if (room === app.defaultRoom) {
          // create the 'Chadam\'s and Max\'s' feed' room
          $('#roomForm').append('<option value=' + app.defaultRoom + '>' + app.defaultRoom + '</option>');
        } else if (room === newRoomName) {
          $('#roomForm').append('<option selected="selected" value=' + room + '>' + room.slice(0, 50) + ' (' + app.roomsByPopularity[room] + ')</option>');
        } else {
          $('#roomForm').append('<option value=' + room + '>' + room.slice(0, 50) + ' (' + app.roomsByPopularity[room] + ')</option>');
        }
      }
      
      let currentFeed = app.chatHistory.results.filter(tweet => {
        return (tweet.roomname === document.getElementById('roomForm').value);
      });
      
      let feedLimit = Math.min(20, currentFeed.length);
      for (let i = 0; i < feedLimit; i++) {
        app.renderMessage(currentFeed[i]);
      }
    };
    
    this.fetch(roomFilter, successfulCB);
    
    // re-render messages
  
    
  },
  'init': function() {
    
    let startingCB = function (data) {
      app.chatHistory = data;
      
      // post all messages up to 20
      let feedLimit = Math.min(20, app.chatHistory.results.length);
      for (let i = 0; i < feedLimit; i++) {
        app.renderMessage(app.chatHistory.results[i]);
      }
      
      app.roomsList = [];
      app.roomsByPopularity = {};
      
      // find all rooms
      app.chatHistory.results.forEach(tweet => {
        app.roomsByPopularity[tweet.roomname] = app.roomsByPopularity[tweet.roomname] + 1 || 1;
      });
      
      for (let key in app.roomsByPopularity) {
        app.roomsList.push(key);
      }
      
      app.roomsList.push(app.defaultRoom);
      app.roomsByPopularity[app.defaultRoom] = null;
      app.roomsByPopularity[app.defaultRoom] = app.chatHistory.results;
      
      // put rooms in the dropdown list alphabetically
      app.roomsList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      app.roomCount = 0;
      $('#roomForm').empty();
      for (let room of app.roomsList) {
        // populate rooms list with all rooms that have at least one messsage
        app.roomCount++;
        if (room === app.defaultRoom) {
          // create the 'Chadam\'s and Max\'s' feed' room
          $('#roomForm').append('<option selected="selected" value=' + app.defaultRoom + '>' + app.defaultRoom + '</option>');
        } else {
          $('#roomForm').append('<option value=' + room + '>' + room.slice(0, 50) + ' (' + app.roomsByPopularity[room] + ')</option>');
        }
      }
        
    };
    
    this.fetch({order: '-createdAt', limit: 1000}, startingCB);
  },
  
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  handleUsernameClick: function() {},
  handleSubmit: function() {},
  chatHistory: {},
  roomsByPopularity: {},
  rooomCount: 0,
  roomsList: [],
  defaultRoom: 'Chadam\'s and Max\'s Feed'
  
};

$(document).ready(function() {
  app.init();

  $('#submitButton').on('click', function(event) {
    var newMessage = {
      username: '',
      text: '',
      roomname: ''
    };
    newMessage.username = window.location.search.substr(window.location.search.indexOf('=') + 1);
    newMessage.text = document.getElementById('messageText').value;
    newMessage.roomname = document.getElementById('roomForm').value;
    app.send(newMessage);
    app.renderMessage(newMessage);
    let newRoomCount = app.roomsByPopularity[document.getElementById('roomForm').value];
    let newRoomName = document.getElementById('roomForm').value + ' (' + (newRoomCount + 1) + ')';
    $('#roomForm option:selected').text(newRoomName);
  });
  
  $('#roomForm').on('change', function(event) {
    
    app.renderRoom();
  });
  

});