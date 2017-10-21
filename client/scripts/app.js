var message = {
  username: 'MaxAndChadam',
  text: 'what is up 83s',
  roomname: '4chan'
};

var badIDs = [];
var weirdInputsIDs = [];

var app = {

  'send': function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  'fetch': function(obj = {order: '-createdAt', limit: 100}) {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: obj, // data: 'where={"createdAt":{"$gte":"2017-10-01T19:00:11.641Z"}}',
      contentType: 'json',
      success: function (data) {
        app.chatHistory = data;
        // load most recent 10 messages in feed
        for (var i = 0; i < app.chatHistory.results.length - 1; i++) {
          debugger;
          // console.log(app.chatHistory.results[i]);
          // if (!(app.chatHistory.results[i].username === undefined || app.chatHistory.results[i].username === null || app.chatHistory.results[i].text === undefined || app.chatHistory.results[i].text === null)) {
          // if (
          //   app.chatHistory.results[i].text === undefined || 
          //   app.chatHistory.results[i].text === null || 
          //   app.chatHistory.results[i].username === undefined || 
          //   app.chatHistory.results[i].username === null || 
          //   app.chatHistory.results[i].roomname === undefined || 
          //   app.chatHistory.results[i].roomname === null
          //   ) {
          //   weirdInputsIDs.push(app.chatHistory.results[i].objectId);
          // } else 
          // if ((
          // // if ((app.chatHistory.results[i].text.includes('script') || 
          //   // app.chatHistory.results[i].username.includes('script') || 
          //   app.chatHistory.results[i].roomname.includes('Math.') || 
          //   app.chatHistory.results[i].roomname.includes('script')
          //   // app.chatHistory.results[i].roomname === 'lobby'
          //   )) {
          //   debugger;
          //   badIDs.push(app.chatHistory.results[i].objectId);
          // } else {
            app.renderMessage(app.chatHistory.results[i]);
          // }
          // }
        }
        
        // comb most recent 100 messages to find all rooms used
        app.chatHistory.results.forEach((el)=> {
          if (!app.mostPopularRooms.hasOwnProperty(el.roomname)) {
            app.mostPopularRooms[el.roomname] = 1;
          } else {
            app.mostPopularRooms[el.roomname]++;
          }
        });
        
        // find the most popular rooms
  
        for (var key in app.mostPopularRooms) {
          if (app.mostPopularRooms[key] > 1) {
            app.roomCount++;
            var roomVal = 'room' + app.roomCount;
            $('.roomForm').prepend('<option value=' + key + '>' + key + '</option>');
          }
        }
        
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
    
  },
  'clearMessages': function() {},
  
  'renderMessage': function(obj) {
    if (obj.username === undefined) {
      obj.username = 'chiefKeef';
    }
    if (obj.text === undefined) {
      obj.text = 'chiefKeef';
    }

    $('#chats').append('<div class="singleTweet"><p class="username">' + obj.username + '</p><p>' + obj.text + '</p></div>');

  },
  
  'renderRoom': function() {
    
  },
  'init': function() {
    app.fetch({order: '-createdAt', limit: 100});
    
    // search for all room names and put in mostPopularRooms
  },
  'server': 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  'handleUsernameClick': function() {},
  'handleSubmit': function() {},
  'chatHistory': {},
  'mostPopularRooms': {},
  'roomCount': 0
  
  
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
      username: '<script>document.body.style.backgroundColor = "red";</script>',
      text: '',
      roomname: ''
    };
    
    newMessage.username = window.location.search.substr(window.location.search.indexOf('=') + 1);
    if (newMessage.username.indexOf('%') !== -1) {
      newMessage.username = newMessage.username.split('%20').join('');
    }
    debugger;
    newMessage.text = document.getElementById('messageText').value;
    if (newMessage.text.indexOf('<') !== -1) {
      newMessage.text = 'Someone tried to hack you with this code: \n' + newMessage.text.substring(newMessage.text.indexOf('>') + 1, newMessage.text.lastIndexOf('<'));
    }
    newMessage.roomname = document.getElementsByClassName('roomForm')[0].value;


    app.send(newMessage);
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