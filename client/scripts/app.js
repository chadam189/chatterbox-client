var message = {
  username: 'MaxAndChadam',
  text: 'what is up 83s',
  roomname: '4chan'
};

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
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
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
        for (var i = 0; i < 10; i++) {
          app.renderMessage(app.chatHistory.results[i]);
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
        
        // for (var key in app.mostPopularRooms) {
        //   if (app.mostPopularRooms[key] >= 10) {
        //     app.renderRoom(key);
        //   }
        // }
        
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
    
  },
  'clearMessages': function() {},
  
  'renderMessage': function(obj) {

    $('#chats').prepend('<div class="singleTweet"><p class="username">' + obj.username + '</p><p>' + obj.text + '</p></div>');

  },
  
  'renderRoom': function() {},
  'init': function() {
    app.fetch({order: '-createdAt', limit: 200});
    
    // search for all room names and put in mostPopularRooms
  },
  'server': 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  'handleUsernameClick': function() {},
  'handleSubmit': function() {},
  'chatHistory': {},
  'mostPopularRooms': {},
  
  
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

});



// var obj = {
//      "city": "chennai",
//      "cheatMode": false
//  };
//  var query = encodeURIComponent('where={ JSON.stringify(obj)});


