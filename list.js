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
  var totalPrice = 0;   
  var location = window.location.href;
    var uid = location.split("=%20");
    uid = uid[1];

//My Original Idea was to have the actually subtract button hidden until they entered a price.
//When you add a price to the price div, it takes away the subtract button.
//When you add a item to the list, it gives the item div two buttons instead of one.
//Let me know if there is any other problems or if you think there is something that you think I should add.

//========================================================================================================================================

//What I have left to do:
//Add close button to the subtract div

//========================================================================================================================================

//In the future: 
//Add a part of the web app that allows users to look each other up and share the lists with each other.
 
function init(){
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        if(firebaseUser){
            head();
            function head(){
                var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid);
                ref.once("value", function(snapshot){
                    var data = snapshot.val();
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
                    var h4 = data.Item;
                
                //Div for Item
                var div = document.createElement("div");
                div.className = "listItemElement";
                div.id = key + "div";
                //h4 Element
                var h4Element = document.createElement("h4");
                h4Element.textContent = h4;
                //Append h4 to div
                $(div).append(h4Element);
                //Button Div
                var buttonDiv = document.createElement("div");
                buttonDiv.className = "deleteButtonDiv";
                buttonDiv.id = key + "deleteButtonDiv";
                //Delete Button
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "deleteButton";
                deleteButton.id = key + "deleteButton";
                //Append delete button to button div
                $(buttonDiv).empty();
                $(buttonDiv).append(deleteButton);
                //Append button div to Items div
                $(div).append(buttonDiv);
                //Append Items div to List Element in the body
                $('#listItems').append(div);
                });
            }
        }else{

        }
    });
    $('#postItem').on('click', send);
    $(document.body).on('click', '#logout', logout);
    $(document.body).on('click', '#leave', leave);
    $(document.body).on('click', '.deleteButton', remove);
    $(document.body).on('click', '.sub', subtract);
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
                pullRef.off();
                
                //Div for Item
                var div = document.createElement("div");
                div.className = "listItemElement";
                div.id = key + "div";
                //h4 Element
                var h4Element = document.createElement("h4");
                h4Element.textContent = h4;
                //Append h4 to div
                $(div).append(h4Element);
                //Button Div
                var buttonDiv = document.createElement("div");
                buttonDiv.className = "deleteButtonDiv";
                buttonDiv.id = key + "deleteButtonDiv";
                //Delete Button
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "deleteButton";
                deleteButton.id = key + "deleteButton";
                //Append delete button to button div
                $(buttonDiv).empty();
                $(buttonDiv).append(deleteButton);
                //Append button div to Items div
                $(div).append(buttonDiv);
                //Append Items div to List Element in the body
                $('#listItems').append(div);
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
            var btnId = $(this).attr("id");
            btnId = btnId.split("deleteButton");
            btnId = btnId[0];
            var ref = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/Items/' + btnId).remove();
            var id = $(this).attr("id");
            $(this).remove();       
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid);
            ref.once('value', function(snapshot){
                var data = snapshot.val();
                var trueFalse = data.TrueFalse; 
                trueFalse = String(trueFalse);

                if(trueFalse === "true"){
                    add();
                }else{
                    console.log("UnChecked");
                    init();
                }
            });

            function add(){
                console.log("checked");
                //Create Div for Elements
                var div = document.createElement("div");
                div.id = "item";
                //Create Input Element 
                var input = document.createElement("input");
                //Set input attributes 
                input.setAttribute('type', 'number');
                input.setAttribute('placeholder', 'Enter the price of the item');
                //Set class and id for input 
                input.className = "addInput";
                input.id = id + "input";
                //Append input to div
                $(div).append(input);
                //Button
                var button = document.createElement("button");
                button.textContent = "Enter";
                //button id and class
                button.className = "add";
                button.id = id + "enterButton";
                //Append Button to div 
                $(div).append(button);
                //Append div to list Item
                var divId = id.split("deleteButton");
                divId = divId[0];
                divId = divId + "div";
                document.getElementById(divId).appendChild(div);
                
                $('.add').on('click', function(){
                    var price = $(".addInput").val();
                    $(".addInput").remove();
                    $(".add").remove();
                    price = Number(price);
                    totalPrice = price + totalPrice;
                    totalPrice.toFixed(2);
                    totalPriceString = String("Your current Total is: " + totalPrice);
                    var totalPriceH2 = document.createElement("h2");
                    totalPriceH2.textContent = totalPriceString;
                    var priceDiv = document.getElementById("price");
                    $(priceDiv).empty();
                    $(priceDiv).append(totalPriceH2);
                });

                $('.add').keyup(function(event){
                    if(event.keyCode === 13){
                        var price = $(".addInput").val();
                        $(".addInput").remove();
                        $(".add").remove();
                        price = Number(price).toFixed(2);
                        totalPrice = price + totalPrice;
                        totalPriceString = String("Your current Total is: " + "$" + totalPrice);
                        var totalPriceH2 = document.createElement("h2");
                        totalPriceH2.textContent = totalPriceString;
                        var priceDiv = document.getElementById("price");
                        $(priceDiv).empty();
                        $(priceDiv).append(totalPriceH2);
                    }
                });
            }
        }else{
            console.log("no user");
        }
    });
}

function subtract(){
    $('#subInput').show();
    $('#subButton').show();

    $('#subButton').on('click', function(){
        var input = $('#subInput').val();
        input = Number(input);
        totalPrice = totalPrice - input;
        var totalPriceString = String("Your current Total is: " + totalPrice);
        var totalPriceH2 = document.createElement("h2");
        totalPriceH2.textContent = totalPriceString;
        $('#price').append(totalPriceH2);
    });
}
})();