(function(){
    $(document).ready(init);
    var config = {
    apiKey: "AIzaSyCupVVwqzyykSt3iX995Tqy9_Fh_kN1V28",
    authDomain: "lists-eb84f.firebaseapp.com",
    databaseURL: "https://lists-eb84f.firebaseio.com",
    projectId: "lists-eb84f",
    storageBucket: "",
    messagingSenderId: "213245987982"
  };
  var location = window.location.href;
    var uid = location.split("=%20");
    uid = uid[1];
 
function init(){
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            head();
            function head(){
                var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid);
                ref.on("value", function(snapshot){
                    var data = snapshot.val();
                    console.log(data);
                    
                    for(var i = 0; i < 1; i++){
                        var h2 = document.createElement("h2");
                        h2.textContent = data.ListName;
                        var h4 = document.createElement("h4");
                        h4.textContent = data.Date;
                        var h6 = document.createElement("h4");
                        h6.textContent = data.ListDescription;
                        $('body').prepend(h2, h4, h6);
                    }
                });
                items();
            }
            function items(){
                var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid + "/Items");
                ref.on("child_added", function(snapshot){
                    var data = snapshot.val();
                    var key = snapshot.key;
                    var keyArray = [key];
                    console.log(keyArray.length);
                    var h4 = data.Item;
                
                var ItemDiv = document.createElement("div");
                ItemDiv.className = "listItem";
                ItemDiv.id = key + "div";
                //h4
                var h4Element = document.createElement("h4");
                h4Element.textContent = h4;
                ItemDiv.appendChild(h4Element);
                //Button Div
                var buttonDiv = document.createElement("div");
                buttonDiv.className = "buttonDiv";
                //Button
                var buttonElement = document.createElement("button");
                buttonElement.textContent = "Delete";
                buttonElement.className = "Delete";
                buttonElement.id = key;
                buttonDiv.appendChild(buttonElement);
                ItemDiv.appendChild(buttonDiv);

                //Append to DOM
                document.getElementById("listItems").appendChild(ItemDiv);
                    
                });
            }
        }else{

        }
    });
    $('#postItem').on('click', send);
    $(document.body).on('click', '#logout', logout);
    $(document.body).on('click', '#leave', leave);
    $(document.body).on('click', '.Delete', remove);
    $('#item').keyup(function(event){ 
        if(event.keyCode === 13){
            send();
        }
    })
}

function send(){
    var listItem = $('#item').val();
    $('#item').val('');

    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid + "/Items");
            ref.push({
                Item:listItem,
            });
            var pullRef = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid + "/Items")
            pullRef.once("value", function(snapshot){
                var data = snapshot.val();
                var key = snapshot.key;
                var h4 = data.Item;
                
                var ItemDiv = document.createElement("div");
                ItemDiv.className = "listItem";
                ItemDiv.id = key + "div";
                //h4
                var h4Element = document.createElement("h4");
                h4Element.textContent = h4;
                ItemDiv.appendChild(h4Element);
                //Button Div
                var buttonDiv = document.createElement("div");
                buttonDiv.className = "buttonDiv";
                buttonDiv.id = h4;
                //Button
                var buttonElement = document.createElement("button");
                buttonElement.textContent = "Delete";
                buttonElement.className = "Delete";
                buttonElement.id = key;
                buttonDiv.appendChild(buttonElement);
                $(buttonDiv).empty();
                ItemDiv.appendChild(buttonDiv);

                //Append to DOM
                document.getElementById("listItems").appendChild(ItemDiv);
            });
        }else{
            console.log("no user");
        }
    });
}

function logout(){
    firebase.auth().signOut().then(function(){
        window.location.replace("login.html");
    })
}

function leave(){
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            window.location.replace("homeLists.html?room= " + firebaseUser.uid);
        }else{

        }
    })
}

function remove(){
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            var btnId = $(this).attr('id');
            console.log(btnId);
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid + "/Items/" + btnId);
            ref.remove();
            $(this).remove();
        }else{
            console.log("no user");
        }
    });
}
})();
