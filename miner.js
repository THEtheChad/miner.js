//
// CUSTOMIZATION
//
var SUBMISSION_URL = "https://script.google.com/macros/s/AKfycbzMERYMJ3QI7-gjmP9R6BDttfv0UyJ3TAIbe0fpyxJ_luJW0q87/exec";

var FIELDS = {
  "":"...",
  "formID":"formID",
  "ciceroID":"ciceroID",
  "legState":"legState",
  "district":"district",
  "legFirst":"legFirst",
  "legLast":"legLast",
  "notes":"notes",
  "testresult":"testresult",
  "emailconfirmed":"emailconfirmed",
  "impossible":"impossible",
  "sendcontenttype":"sendcontenttype",
  "sendallowredirect":"sendallowredirect",
  "crawlfirst":"crawlfirst",
  "passes":"passes",
  "method":"method",
  "prefixF":"prefixF",
  "firstnameF":"firstnameF",
  "lastnameF":"lastnameF",
  "addressF":"addressF",
  "cityF":"cityF",
  "stateF":"stateF",
  "stateDV":"stateDV",
  "zip5F":"zip5F",
  "zip5confirmF":"zip5confirmF",
  "zip4F":"zip4F",
  "phoneF":"phoneF",
  "phoneconfirmF":"phoneconfirmF",
  "emailF":"emailF",
  "emailConfirmF":"emailConfirmF",
  "responseF":"responseF",
  "newsletterF":"newsletterF",
  "issueF":"issueF",
  "issue-guns":"issue-guns",
  "issue-education":"issue-education",
  "issue-gays":"issue-gays",
  "issue-women":"issue-women",
  "issue-immigration":"issue-immigration",
  "subjectF":"subjectF",
  "messageF":"messageF",
  "submitF":"submitF",
  "submitV":"submitV",
  "successString":"successString",
  "dtlastupdate":"dtlastupdate"
};

//
// GLOBAL VARS
//
var body = document.getElementsByTagName('body')[0];

var ON, YES = ON = true;
var NO, OFF = NO = false;

var color_highlighted = "#ff0";
var color_selected    = "#00ff00";

//
// UTILITY FUNCTIONS
//

// add event cross browser
// http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
function addEvent(elem, event, fn) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions
    function listenHandler(e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation();
            e.preventDefault();
        }
        return(ret);
    }

    function attachHandler() {
        // set the this pointer same as addEventListener when fn is called
        // and make sure the event is passed to the fn also so that works the same too
        var ret = fn.call(elem, window.event);   
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return(ret);
    }

    if (elem.addEventListener) {
        elem.addEventListener(event, listenHandler, false);
    } else {
        elem.attachEvent("on" + event, attachHandler);
    }
}

function valid(target){
  return target.name !== undefined && !/exception/.test(target.className);
}

//
// GLOBAL EVENT BINDINGS
//

addEvent(body, "mouseover", function(e){
  var target = e.srcElement;
  if(valid(target)){
    highlight(target, ON);
  }
});

addEvent(body, "mouseout", function(e){
  var target = e.srcElement;
  if(valid(target)){
    highlight(target, OFF);
  }
});

addEvent(body, "mousedown", function(e){
  var target = e.srcElement;

  if(valid(target)){
    e.preventDefault();
    if(selected(target)){
      removeDialogue(e);
    }
    else{
      addDialogue(e);
    }
  }else if(!/exception/.test(target.className)){
    modal.remove();
  }
});

//
// ELEMENT STATES
//
function selected(ele, state){
  if(state === undefined){
    return ele.__selected ? YES : NO;
  }else{
    if(state == YES){
      ele.style.background = color_selected;
      ele.style.outline = "1px solid " + color_selected;
      ele.__selected = YES;
    }else{
    //(state == NO)
      ele.style.background = "";
      ele.style.outline = "";
      ele.__selected = NO;
    }
  }
}

function highlight(ele, state){
  if(state === undefined){
    return ele.__highlighted ? YES : NO;
  }else{
    if(state == YES){
      ele.style.outline = "5px solid " + color_highlighted;
    }else{
    //(state == NO)
      if(selected(ele)){
        ele.style.outline = "1px solid " + color_selected;
      }else{
        ele.style.outline = "";
      }
    }
  }
}

//
// MODALS
//
var modal;
var selected_elements = [];
var element_type = [];

function createModal(e){
  modal = document.createElement('div');
  modal.id = "modal";
  modal.style.position = "absolute";
  modal.style.background = "#fcfcfc";
  modal.style.border = "2px solid #555";
  modal.style.padding = "10px";
  modal.style.zIndex = "1000";
  modal.style.left = (e.pageX - 30)+ "px";
  modal.style.top  = (e.pageY - 40) + "px";
}

function addDialogue(e){
  createModal(e);
  modal.innerHTML = '<div>What type of input is this?</div>';

  var select = document.createElement('select');
  select.className = "exception";

  for(var prop in FIELDS){
    var option = document.createElement('option');
    option.value = prop;
    option.innerHTML = FIELDS[prop];

    select.appendChild(option);
  }

  modal.appendChild(select);

  addEvent(select, "change", function(){
    var selected_element = e.srcElement;

    selected_elements.push(selected_element);
    element_type.push(select.value);
    selected(selected_element, YES);

    modal.remove();
  });

  body.appendChild(modal);
}

function removeDialogue(e){
  createModal(e);
  modal.innerHTML = '<div>Remove this field?</div>';

  var yes = document.createElement('input');
  yes.className = "exception";
  yes.type = "button";
  yes.value = "Yes";

  var no = document.createElement('input');
  no.className = "exception";
  no.type = "button";
  no.value = "No";

  modal.appendChild(yes);
  modal.appendChild(no);

  addEvent(yes, "click", function(){
    var index = selected_elements.indexOf(e.srcElement);
    selected_elements.splice(index, 1);
    element_type.splice(index, 1);
    selected(e.srcElement, NO);

    modal.remove();
  });

  addEvent(no, "click", function(){
    modal.remove();
  });

  body.appendChild(modal);
}


var data = {};

//
// Get current URL
//
data.url = location.href;

//
// Collect form actions
//
var actions = [];
var forms = document.getElementsByTagName("form");
for(var i = 0, ilen = forms.length; i < ilen; i++){
  var temp = document.createElement("div");
  temp.appendChild(forms[i].cloneNode());
  actions.push(temp.innerHTML);
}
data.actions = actions.join("\n");

//
// Collect hidden fields
//
var hidden = [];
var inputs = document.getElementsByTagName("input");
for(var i = 0, ilen = inputs.length; i < ilen; i++){
  var input = inputs[i];
  if(input.type && input.type.toLowerCase() == "hidden"){
    hidden.push(input.name + "=" + input.value);
  }
}
data.hidden = hidden.join("\n");

var http = new XMLHttpRequest;
http.open("POST", SUBMISSION_URL, true);
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

function encodedData(){

  for(var i = 0, ilen = selected_elements.length; i < ilen; i++){
    var ele  = selected_elements[i];
    var type = element_type[i];

    if(data[type] === undefined){
      data[type] = "";
    }

    if(ele.tagName == "SELECT"){
      var opts = ele.options;
      var name = ele.name;
      for(var j = 0, jlen = opts.length; j < ilen; j++){
        data[type] += name + "=" + ele.value + "\n";
      }
    }else{
      data[type] += ele.name + "=" + ele.value + "\n";
    }
  }

  return serialize(data);
}

function serialize(obj){
  var token = [];
  for(var k in obj){
    token.push(encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]));
  }
  return token.join("&");
}

document.onkeydown = function(e){
  var enter = 13;

  if (e && e.keyCode == enter) {
    http.send(encodedData());
    alert("Data Sent!");
  }
}