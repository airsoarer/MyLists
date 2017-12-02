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
    $('#submit').on('click', createList);
    $('#leave').on('click', goHome);
    $('#description').keyup(function(event){
        if(event.keyCode === 13){
            createList();   
        }
      });
    $('#listItem').keyup(function(event){
        if(event.keyCode === 13){
           createList();
           }
    }); 
}

function createList(){
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth()+1;
   var yyyy = today.getFullYear();
   var date = mm + "/" + dd +"/" + yyyy;
   console.log(date);
   var listName = $('#listName').val();
   var listDescription = $('#description').val();
   var shoppingList = $('#checkBox').is(":checked");
   console.log(shoppingList);
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists").push({
                Date:date,
                ListName:listName,
                ListDescription:listDescription,
                TrueFalse:shoppingList,
            }).then(function(){
                var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists");
                ref.on("child_added", function(snapshot){
                    var key = snapshot.key;
                    console.log(key);
                    location.replace("list.html?room= " + key);
                });
            });
        }else{
            console.log("no user");
        }
    });
}

function goHome(){
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            window.location.replace("homeLists.html?room= " + firebaseUser.uid)
        }else{
            console.log("no user");
        }
    })
}
})();