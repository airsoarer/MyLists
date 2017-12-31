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
      var tempId;
      var location = window.location.href;
            var uid = location.split("=%20");
            uid = uid[1];
function init(){
    firebase.initializeApp(config);
    var ref = firebase.database().ref('Users/' + uid + '/Info');
    ref.once('value', function(snapshot){
        var data = snapshot.val();

        //NAME
        var name = document.createElement("h4");
        name.textContent = "Name: " + data.Name;
        var del = document.createElement("p");
        del.textContent = data.Name;
        $(del).css('color', '#2b2b2b');
        $('#nameDelete').append(del);
        $('#nameDiv').prepend(name);
        //EMAIL
        var email = document.createElement("h4");
        var user = firebase.auth().currentUser;
        var Email = user.email;
        email.textContent = "Email: " + Email;
        $('#emailDiv').prepend(email);
        //PASS
        var pass = document.createElement("h4");
        pass.textContent = "Password: " + data.Password;
        $('#passDiv').prepend(pass);
    });
    var ref = firebase.database().ref("Users/" + uid + "/Lists");
    ref.on("child_added", function(snapshot){
        var keys = snapshot.key;
        keys = [keys];
        var data = snapshot.val();

        var listElement = document.createElement("div");
        listElement.className = "listElement";
        var textElement = document.createElement("div");
        textElement.className = "text";
        var listName = document.createElement("h4");
        listName.textContent = data.ListName
        var listDate = document.createElement("h5");
        listDate.textContent = data.Date;
        var listDescription = document.createElement("h5");
        listDescription.textContent = data.ListDescription;
        textElement.appendChild(listName);
        textElement.appendChild(listDate);
        textElement.appendChild(listDescription);
        for(var i in data){
            if(data[i].SharedWith){
                var listShare = document.createElement("h5");
                listShare.textContent = "Shared with: " +data[i].SharedWith;
                $(listShare).css('color', '#000000');
                textElement.appendChild(listShare);
            }
        }
        listElement.appendChild(textElement);
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
        $(link).css('color', '#f7f7f7');
        $(openBtn).css('background-color', '#4b5b5b');
        $(openBtn).css('border-radius', '10px');
        $(openBtn).css('border-bottom-right-radius', '0px');
        $(openBtn).css('border-top-right-radius', '0px');
        //Share Button
        var shareBtnDiv = document.createElement("div");
        shareBtnDiv.className = "shareBtn";
        var shareBtn = document.createElement("button");
        shareBtn.className = "share";
        var shareLink = document.createElement("a")
        shareLink.setAttribute('href', 'share.html?room= ' + keys);
        shareLink.textContent = "Share this List";
        shareBtn.appendChild(shareLink);
        shareBtnDiv.appendChild(shareBtn);
        $(shareLink).css('color', '#f7f7f7');
        $(shareBtn).css('background-color', '#4b5b5b');
        $(shareBtn).css('border-bottom-right-radius', '0px');
        $(shareBtn).css('border-bottom-left-radius', '0px');
        $(shareBtn).css('border-top-left-radius', '0px');
        $(shareBtn).css('border-top-right-radius', '0px');
        buttonsDiv.appendChild(shareBtnDiv);
        //Delete Button
        var deleteBtnDiv = document.createElement("div");
        deleteBtnDiv.className = "deleteBtn";
        var deleteBtn = document.createElement("button");
        deleteBtn.className = "Delete";
        deleteBtn.id = keys;
        deleteBtnDiv.appendChild(deleteBtn);
        $(deleteBtn).css('color', '#f7f7f7');
        $(deleteBtn).css('background-color', '#991818');
        $(deleteBtn).css('border-radius', '10px');
        $(deleteBtn).css('border-top-left-radius', '0px');
        $(deleteBtn).css('border-bottom-left-radius', '0px');
        buttonsDiv.appendChild(deleteBtnDiv);
        deleteBtn.textContent = "Delete";

        listElement.appendChild(buttonsDiv);
        $('#n').append(listElement);
    });   

    $(document.body).on('click', '.change', show);
    $(document.body).on('click', '.button', update);
    $(document.body).on('click', '#leave', goHome);
    $(document.body).on('click', '#deleteBtn', del);
}

function show(){
    var id = $(this).attr('id');
    //Div
    var div = document.createElement("div");
    div.className = "newData";
    //Input
    var input = document.createElement("input");
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter new ' + id);
    input.className = "input";
    input.id = id + "Input";
    tempId = input.id;
    $(div).append(input);
    //Button
    var button = document.createElement("button");
    button.textContent = "Enter";
    button.className = "button";
    button.id = id + "Button";
    $(div).append(button);

    var divId = id + "Div";
    document.getElementById(divId).appendChild(div);
}

function update(){
    var id = $(this).attr("id");
    id = id.split("Button");
    id = id[0];
    var option = id;
    console.log(id + "Input");
    tempId = "#" + tempId;
    var val = $(tempId).val();

    if(option === "name"){
        var dbName = firebase.database().ref('Users/' + uid + '/Info');
        var update1 = {
            Name:val
        }
        return dbName.update(update1);
        $('.newData').css('display', 'none');
    }else if(option === "email"){
        var dbEmail = firebase.database().ref('Users/' + uid + '/Info');
        var update2 = {
            Email:val
        }
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                console.log(firebaseUser);
                firebaseUser.updateEmail(val);
            }
        });
        $('.newData').css('display', 'none');
        return dbEmail.update(update2);
    }else if(option === "pass"){
        var dbPass = firebase.database().ref('Users/' + uid + '/Info');
        var update3 = {
            Password:val
        }
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                firebaseUser.updatePassword(val);
            }
        });
        $('.newData').css('display', 'none');
        return dbPass.update(update3);
    }
}

function goHome(){
    window.location.replace("homeLists.html?room= " + uid);
}

function del(){
    var awnser = prompt("Are you sure?\n Type YES, or NO");
    if(awnser === 'YES'){
        firebase.database().ref('Users/' + uid).remove();
        window.location.replace('login.html');
    }else{
        init();
    }
}
})();