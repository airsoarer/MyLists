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
                    var title = document.createElement("title");
                    title.textContent = data.ListName + " — MyLists";
                    $('head').append(title);
                    for(var i = 0; i < 1; i++){
                        var h2 = document.createElement("h2");
                        h2.textContent = data.ListName;
                        var h4 = document.createElement("h4");
                        h4.textContent = data.Date;
                        var h6 = document.createElement("h4");
                        h6.textContent = data.ListDescription;
                        $('body').prepend(h2, h4, h6);
                    }
                    var newRef = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid);
                    newRef.once('value', function(snapshot){
                        var data = snapshot.val();
                        if(data.TrueFalse === "true"){
                            if(data.Price){
                                var price = data.Price;
                                totalPrice = price;
                                var string = document.createElement("h2");
                                string.textContent = "Your current Total is: " + price;
                                $('#total').append(string);
                            }else{
                                var txt = document.createElement("h2");
                                txt.textContent = "No totaled amount";
                                $('#total').append(txt);
                            }
                        }else{
                            $('#subBtn').hide();
                        }
                    });
                });
                items();
            }
            function items(){
                //TODO: add checked items to DOM
                var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid + "/Items");
                ref.on("child_added", function(snapshot){
                    var data = snapshot.val();
                    var key = snapshot.key; 
                    var h4 = data.Item;
                
                    var div = document.createElement("div");
                    div.className = "listItemElement";
                    div.id = key + "div";
    
                    var checkbox = document.createElement("input");
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.id = "check" + key;
                    checkbox.className = "check";
    
                    var label = document.createElement("label");
                    label.setAttribute('for', 'check' + key);
                    label.innerHTML = h4;
                    label.id = "label" + key;
                    $(label).css('font-size', '36px');
                    $(label).css('color', '#c9d1c9');
    
                    $(div).append(checkbox, label);
                    $('#listItems').append(div);
                });

//Get checked Items
//================================================================================
                    var checkedRef = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/CheckedItems');
                    checkedRef.on('child_added', function(snapshot){
                        var checkedData = snapshot.val();
                        var checkedKey = snapshot.key;
                        var checkedH4 = checkedData.Item          

                    var div = document.createElement("div");
                    div.className = "listItemElement";
                    div.id = checkedKey + "div";

                    var checkbox = document.createElement("input");
                    checkbox.setAttribute('type', 'checkbox');
                    $(checkbox).attr('checked', 'checked');
                    checkbox.id = "check" + checkedKey;
                    checkbox.className = "checked";

                    var label = document.createElement("label");
                    label.setAttribute('for', 'check' + checkedKey);
                    label.innerHTML = checkedH4;
                    label.id = "label" + checkedKey;
                    $(label).css('font-size', '36px');
                    $(label).css('color', '#c9d1c9');

                    $(div).append(checkbox, label);
                    $('#checked').append(div);
                });
            }
        }else{

        }
    
    });
    $('#postItem').on('click', send);
    $(document.body).on('click', '#logout', logout);
    $(document.body).on('click', '#leave', leave);
    $(document.body).on('click', '.check', remove);
    $(document.body).on('click', '.sub', subtract);
    $(document.body).on('click', '.checked', addBack);
    $(document.body).on('click', '#x', close);
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
            pullRef.once("child_added", function(snapshot){
                var data = snapshot.val();
                var key = snapshot.key;
                var item = data.Item;
                pullRef.off();
                
                //Div for Item
                var div = document.createElement("div");
                div.className = "listItemElement";
                div.id = key + "div";

                var checkbox = document.createElement("input");
                checkbox.setAttribute('type', 'checkbox');
                checkbox.id = "check" + key;
                checkbox.className = "check";

                var label = document.createElement("label");
                label.setAttribute('for', 'check' + key);
                label.innerHTML = item;
                label.id = "label" + key;
                $(label).css('font-size', '36px');
                $(label).css('color', '#9b6b6b');

                $(div).append(checkbox, label);
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
            var btnIdVal = $(this).val();
            $(this).remove();
            btnId = btnId.split("check");
            btnId = btnId[1];
            var labelId = document.getElementById("label" + btnId).innerHTML;
            var x = btnId + "div";
            console.log(x);
            $(x).html('');
            firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/Items/' + btnId).remove();
            var ref = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/CheckedItems');
            ref.push({
                Item:labelId,
            });
            var id = $(this).attr("id");
            var ref = firebase.database().ref("Users/" + firebaseUser.uid + "/Lists/" + uid);
            ref.once('value', function(snapshot){
                var data = snapshot.val();
                console.log(data.TrueFalse);
                var trueFalse = data.TrueFalse; 
                trueFalse = String(trueFalse);

                if(trueFalse === "true"){
                    add();
                }else if(trueFalse === "false"){
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
                var divId = id.split("check");
                divId = divId[1];
                divId = divId + "div";
                console.log(divId);
                document.getElementById(divId).appendChild(div);
                
                $('.add').on('click', function(){
                    var price = $(".addInput").val();
                    $(".addInput").remove();
                    $(".add").remove();
                    price = Number(price);
                    totalPrice = price + totalPrice;
                    totalPrice = Math.round(totalPrice * 100)/100;
                    var auth = firebase.auth().onAuthStateChanged(firebaseUser =>{
                        if(firebaseUser){
                            var ref = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid);
                            var update = {
                                Price:totalPrice
                            }
                            return ref.update(update);
                        }
                    });
                    totalPriceString = String("Your current Total is: " + totalPrice);
                    var totalPriceH2 = document.createElement("h2");
                    totalPriceH2.textContent = totalPriceString;
                    var priceDiv = document.getElementById("total");
                    $(priceDiv).empty();
                    $(priceDiv).append(totalPriceH2);
                    $('.sub').css('display', 'block');
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
    $('#x').show();
    $('#subButton').on('click', function(){
        var input = $('#subInput').val();
        input = Number(input);
        totalPrice = totalPrice - input;
        totalPrice = Math.round(totalPrice * 100)/100;
        var auth = firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                var ref = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid);
                var update = {
                    Price:totalPrice
                }
                return ref.update(update);
            }
        });
        var totalPriceString = String("Your current Total is: " + totalPrice);
        var totalPriceH2 = document.createElement("h2");
        totalPriceH2.textContent = totalPriceString;
        $('#total').empty();
        $('#total').append(totalPriceH2);
        $('#subButton').css('display', 'none');
        $('#subInput').css('display', 'none');
    });
}

function addBack(){
    firebase.auth().onAuthStateChanged(firebaseUser =>{
        var key = $(this).attr('id');
        key = key.split("check");
        key = key[1];
        console.log(key);
        var ref1 = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/CheckedItems' + key);
        ref1.on('child_added', function(snapshot){
            var data = snapshot.val();
            var item = data.Item;
            var ref2 = firebase.database().ref('Users/' + firebaseUser.uid + '/Lists/' + uid + '/Items')
            ref2.push({
                Item:item,
            });
            $(this).empty();
            ref2.on('child_added', function(snapshot){
                var data = snapshot.val();
                var item = data.Item;
                var key = snapshot.key;

                //Div for Item
                var div = document.createElement("div");
                div.className = "listItemElement";
                div.id = key + "div";

                var checkbox = document.createElement("input");
                checkbox.setAttribute('type', 'checkbox');
                checkbox.id = "check" + key;
                checkbox.className = "check";

                var label = document.createElement("label");
                label.setAttribute('for', 'check' + key);
                label.innerHTML = item;
                label.id = "label" + key;
                $(label).css('font-size', '36px');
                $(label).css('color', '#9b6b6b');

                $(div).append(checkbox, label);
                $('#listItems').append(div);

                ref1.remove();
            });
        });
    });
}

function close(){
    $('#subButton').hide();
    $('#subInput').hide();
    $('#x').hide();
}
})();