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
    load();
    function load(){
        var ref = firebase.database().ref("Users/" + uid + "/Lists");
        ref.on("child_added", function(snapshot){
            var keys = snapshot.key;
            keys = [keys];
            console.log(keys);
            var data = snapshot.val();

            //for(var i = 0; i < keys.length; i++){
            var listElement = document.createElement("div");
            listElement.className = "listElement";
            var listName = document.createElement("h4");
            listName.textContent = data.ListName;
            listElement.appendChild(listName);
            //Buttons div
            var buttonsDiv = document.createElement("div");
            buttonsDiv.className = "buttons";
            //open Button
            var openBtnDiv = document.createElement("div");
            openBtnDiv.className = "openBtn";
            var openBtn = document.createElement("button");
            openBtn.className = "open";
            openBtnDiv.appendChild(openBtn);
            buttonsDiv.appendChild(openBtnDiv);
            var link = document.createElement("a");
            link.setAttribute('href', 'list.html?room= ' + keys);
            link.textContent = "Open";
            openBtn.appendChild(link);
            //Delete Button
            var deleteBtnDiv = document.createElement("div");
            deleteBtnDiv.className = "deleteBtn";
            var deleteBtn = document.createElement("button");
            deleteBtn.className = "Delete";
            deleteBtn.id = keys;
            deleteBtnDiv.appendChild(deleteBtn);
            buttonsDiv.appendChild(deleteBtnDiv);
            deleteBtn.textContent = "Delete";

            listElement.appendChild(buttonsDiv);
            document.getElementById("lists").appendChild(listElement);
            //}
        });   
    }
    $(document.body).on('click', '#logout', logout);
    $(document.body).on('click', '#newList', newList);
    $(document.body).on('click', ".Delete", del);
}

function newList(){
    window.location.replace("makeList.html?room= " + uid);
}

function logout(){
    firebase.auth().signOut();
    window.location.replace("login.html");
}

function del(){
    var id = $(this).attr("id");
    var ref = firebase.database().ref("Users/" + uid + "/Lists/" + id);
    ref.remove();
    $(this).parentsUntil(".listElement").remove();
}
})();