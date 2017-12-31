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
    $('#look').on('click', look);
    $('#leave').on('click', leave);
}

function look(){
    var name = $('#name').val();
    var fireRef = firebase.database().ref('Users').once('value', function(snapshot){
        var data = snapshot.val();
        
        for(var i in data){
            var x = data[i].Info;

            if(x.Name === name){
                var userFound = true;
                var key = i;
                copyData();
                function copyData(){
                    var auth = firebase.auth().onAuthStateChanged(firebaseUser =>{
                        if(firebaseUser){
                            var ref = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid);
                            ref.once('value', function(snapshot){
                                console.log(snapshot.key);
                                var fireRef = firebase.database().ref('Users/' + key + '/Lists').push(snapshot.val());

                                //Show who it has been shared with
                                var div = document.createElement("div");
                                div.className = "showDiv";
                                var h2 = document.createElement("h2");
                                h2.textContent = "Your List has been shared with " + name;
                                div.appendChild(h2);
                                $('#display').append(div);

                                var secondRef = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid);
                                secondRef.push({
                                    SharedWith:name,
                                });

                                //NEEDS TO BE FIXED
                                // var unshare = document.createElement("button");
                                // unshare.id = "unshare" + name;
                                // unshare.className = "unshare";
                                // unshare.textContent = "Unshare list with " + name;
                                // div.appendChild(unshare);
                                // $('#display').append(div);

                                // $(document.body).on('click', '.unshare',function(){
                                //     var ref = firebase.database().ref('Users/' + key + '/Lists' + snapshot.key).remove();
                                // });
                            });
                        }
                    });
                    if(userFound === false){
                        alert("User is not found \n Check your spelling and spacing")
                    }
                }
            }else{
                userFound = false;
            }
        }

    });
}

function leave(){
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            window.location.replace("homeLists.html?room= " + firebaseUser.uid);
        }
    });
}
})();