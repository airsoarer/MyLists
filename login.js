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

function init(){
    firebase.initializeApp(config);
    $('#loginBtn').on('click', login);
    $('#signUpBtn').on('click', signUp);
    $('#loginPass').keyup(function(event){
        if(event.keyCode === 13){
            login();
        }
    });
    $('#loginEmail').keyup(function(event){
        if(event.keyCode === 13){
            login();
        }
    });
    $('#signUpPassword').keyup(function(event){
        if(event.keyCode === 13){
            signUp();
        }
    });
}

function login(){
    var email = $('#loginEmail').val();
    var pass = $('#loginPass').val();

    var promise = firebase.auth().signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    stateChangedLogin();
}

function signUp(){
    var email = $('#signUpEmail').val();
    if(email.length < 9){
        alert("Email must be 9 or more characters");
        init();
    }
    var pass = $('#signUpPassword').val();
    if(pass.length < 8){
        alert("Password must be 8 or more characters");
        init();
    }
    var name = $('#name').val();

    var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));

    stateChanged(name, pass, email);
}

function stateChanged(name, pass, email){
    console.log(name, pass, email);
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            console.log(firebaseUser);
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Info").set({
                Name:name,
                Password:pass,
                Email:email,
            }).then(function(){
                location.replace("homeLists.html?room= " + firebaseUser.uid);
            });
        }else{
            console.log("Not Logged In");
        }
    });
}

function stateChangedLogin(){
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            console.log(firebaseUser);
            location.replace("homeLists.html?room= " + firebaseUser.uid);
        }else{
            console.log("Not Logged In");
        }
    });
}
})();