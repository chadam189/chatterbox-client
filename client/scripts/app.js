// these two are default variables used for cleaning the PARSE database of xss attacks
// var badIDs = [];
// var weirdInputsIDs = [];

var app = {
  
  defaultMessage: {
    username: 'MaxAndChadam',
    text: 'what\'s up 83s',
    roomname: '83...youBestBelieve'
  },
  defaultSucccessCB: function (data) { console.log('chatterbox: Message sent'); },
  defaultErrorCB: function (data) { console.error('chatterbox: Failed to send message'); },

  'send': function(message = this.defaultMessage) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: defaultSucccessCB,
      error: defaultErrorCB
    });
  },
  'fetch': function(obj = {order: '-createdAt', limit: 100}, successCB = this.defaultSucccessCB, errorCB = this.defaultErrorCB) {
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
    // if (tweet.username.indexOf('%') !== -1) {
    //   tweet.username = tweet.username.split('%20').join('');
    // }
    // if (tweet.username.includes('script') || (tweet.username.includes('<') && tweet.username.includes('>'))) {
    //   tweet.username = '(some weak hacker)';
    // }
    // if (tweet.username === undefined) {
    //   tweet.username = 'chiefKeef';
    // }
    let text = tweet.text;
    let name = tweet.username;
    // if (text.includes('script') || (text.includes('<') && text.includes('>'))) {
    //   text = "NOOBS TRIED TO PLAY";
    // }
    // if (text === undefined) {
    //   text = 'no text was included';
    // } else if (text.includes('script')) {
    //   text = 'NOOBS TRIED TO PLAY';
    // }
    // if (text.includes('$(.')) {
    //   text = 'Someone tried to hack us with this code: \n' + text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
    // }

    $('#chats').append('<div class="singleTweet"><p class="username">' + name + '</p><p class="tweetMessage">' + text + '</p></div>');

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
      apps.roomsList = [];
      
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
      
      let newRoomName = document.getElementById('roomForm').value;
      
      $('#mySelect').empty();
      
      $('#roomForm').empty();
      for (let room of app.roomsList) {
        // populate rooms list with all rooms that have at least one messsage
        app.roomCount++;
        if (room === app.defaultRoom) {
          // create the 'Chadam\'s and Max\'s' feed' room
          $('#roomForm').append('<option value=' + app.defaultRoom + '>' + app.defaultRoom + '</option>');
        } else if (room === newRoomName) {
          $('#roomForm').append('<option selected="selected" value=' + room + '>' + room + ' (' + app.roomsByPopularity[room] + ')</option>');
        } else {
          $('#roomForm').append('<option value=' + room + '>' + room + ' (' + app.roomsByPopularity[room] + ')</option>');
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
          $('#roomForm').append('<option value=' + room + '>' + room + ' (' + app.roomsByPopularity[room] + ')</option>');
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
  
  // var sampleObj = {
  //   createdAt: '2017-10-21T00:01:16.126Z', 
  //   objectId: '9cCVa02Isj',
  //   roomname: 'superduper',
  //   text: 'Imma let you finish messaging, but Beyonce had one of the best music videos of all time.',
  //   updatedAt: '2017-10-21T00:01:16.126Z',
  //   username: 'Kanye West',
  // };

  // app.renderMessage(sampleObj);

  $('#submitButton').on('click', function(event) {
    
    var newMessage = {
      username: '',
      text: '',
      roomname: ''
    };
    
    newMessage.username = window.location.search.substr(window.location.search.indexOf('=') + 1);
    // if (newMessage.username.indexOf('%') !== -1) {
    //   newMessage.username = newMessage.username.split('%20').join('');
    // }
    // if (newMessage.username.includes('script') || (newMessage.username.includes('<') && newMessage.username.includes('>'))) {
    //   newMessage.username = '(some weak hacker)';
    // }
  
    newMessage.text = document.getElementById('messageText').value;
    // if (newMessage.text.indexOf('<') !== -1) {
    //   newMessage.text = 'Someone tried to hack you with this code: \n' + newMessage.text.substring(newMessage.text.indexOf('>') + 1, newMessage.text.lastIndexOf('<'));
    // }
    newMessage.roomname = document.getElementById('roomForm').value;


    app.send(newMessage);
  });
  
  $('#roomForm').on('change', function(event) {
    
    app.renderRoom();
  });
  

});

// <script>document.getElementById("main").querySelector("h1").innerText = "SPICE GIRLS FAN CLUB!!!"</script> "https://avatars1.githubusercontent.com/u/99825?s=460&v=4"</script>
// <script>document.getElementsByClassName("pagetitle")[0].innerHTML = "SPICE GIRLS FAN CLUB!!!"</script>
// <script>document.body.style.backgroundColor = "red";</script>
// <script>document.body.style.backgroundImage = "url('https://avatars1.githubusercontent.com/u/99825?s=460&v=4')"</script>


// hello nick! <script>document.body.style.backgroundImage = "url'(https://avatars1.githubusercontent.com/u/99825?s=460&v=4)'";</script>
// <a href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwiuyrD96oDXAhVBi1QKHRMDCMcQyCkIKDAA&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&usg=AOvVaw0aHtehaphMhOCAkCydRLZU">Click for my solution</a>

var escaping = function (text) {
  if (text.indexOf('<') !== -1) {
    return 'Someone tried to hack you with this code: \n' + text.substring(text.indexOf('>') + 1, text.lastIndexOf('<'));
  }
  return;
};