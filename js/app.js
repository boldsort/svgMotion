// variables
var htmlCode = "", jsCode = "";

$.fn.ignore = function(sel) {
  return this.clone().find(sel||">*").remove().end();
};
function onlyNumbers(e) {
  var x = event.charCode || event.keyCode;
  if (isNaN(String.fromCharCode(e.which)) && x!=46 || x===32 || x===13 || (x===46 && event.currentTarget.innerText.includes('.'))) e.preventDefault();
}

// load svg file on click
$("[data-call=openfile]").click(function() {
  $("[data-input=openfile]").trigger("click");
});

// load svg file functions
function loadfile(input) {
  var reader = new FileReader();
  var path = input.value;
  reader.onload = function(e) {
    if (path.toLowerCase().substring(path.length - 4 === ".svg")) {
      document.querySelector("[data-output=svg]").innerHTML = e.target.result;
      imageLoaded();
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
    }
  };
  reader.readAsText(input.files[0]);
};
function dropfile(file) {
  var reader = new FileReader();  
  reader.onload = function(e) {
    if (file.type === "image/svg+xml") {
      document.querySelector("[data-output=svg]").innerHTML = e.target.result;
      imageLoaded();
    } else {
      alertify.error("Sorry that file type is not supported. Please only load .svg files.");
    }
  }        
  reader.readAsText(file,"UTF-8"); 
};
function imageLoaded() {
  // locate SVG
  if (document.querySelector("[data-output=svg] > svg")) {
    // remove width/height attributes if detected
    if (document.querySelector("[data-output=svg] > svg").getAttribute("width") || document.querySelector("[data-output=svg] > svg").getAttribute("height")) {
      document.querySelector("[data-output=svg] > svg").removeAttribute("width");
      document.querySelector("[data-output=svg] > svg").removeAttribute("height");
      alertify.log("Width/Height attributes removed for background display.");
    }
    
    $("[data-file=loaded]").fadeIn();
    $("[data-call=openfile]").parent().remove();

    $(document.body).append('<div data-action="fadeOut" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: #fff; z-index: 2;"></div>');
    $("[data-action=fadeOut]").fadeOut(400, function() {
      $("[data-action=fadeOut]").remove();
    });
  } else {
    alertify.error("Error: No svg element detected!");
  }
}

// load svg file once clicked
$("[data-input=openfile]").on("change", function() {
  loadfile(this);
});

// load svg file on drop
$("[data-output=svg]").on("drop", function(e) {
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  dropfile(file);
});

// new/reload
function refresh() {
  swal({
    title: 'Are you sure you want to reload?',
    text: "You will loose all your work and you won't be able to revert this!",
    type: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "./index.html";
    }
  })
}

// run hub code
$("[data-play=animation]").click(function() {
  var elm = $("[data-play=animation] .material-icons");

  if (elm.text() === "play_arrow") {
    // clear full code string
    jsCode = "";
    
    // play animation
    htmlCode = $(".vector").html();
    elm.text("stop");

    var hubs = document.querySelectorAll("[data-grab=hubs] > div");

    for (var i = 0; i < hubs.length; i++) {
      var hubSelector = hubs[i].querySelector("[data-get=selector]").value;
      var hubSpeed = hubs[i].querySelector("[data-get=speed]").value;
      var hubKeyStr = hubs[i].querySelector("[data-place=key]").textContent.toString().replace(/ /g, "").replace(/\n/g, "").replace(/clear/g, ",\n");
      var hubKeys = hubKeyStr.substr(0, hubKeyStr.length - 2);
      var codeStr = 'TweenMax.to(".vector '+ hubSelector +'", '+ hubSpeed +', {\n'+ hubKeys +'\n});\n\n';
      jsCode += codeStr;

//      console.log(codeStr);
//      setTimeout(codeStr, 1);
    }
    setTimeout(jsCode, 1);
  } else {
    // stop animation
    // reset initial svg code
    $(".vector").html("").html(htmlCode);
    
    // reset icon
    elm.text("play_arrow");
  }
});

// add a hub
$("[data-action=addHub]").click(function() {
  if (this.hasAttribute("data-disabled")) {
    alertify.log('Not available in demos');
  } else {
    if (!$(".vector").html()) {
      alertify.error('Error: No svg file detected!');
    } else {
      var hubStr = '<div class="mdl-cell mdl-card mdl-shadow--2dp" data-action="draggable"><div class="mdl-card__title mdl-card--border move" data-action="move"><h2 class="mdl-card__title-text">.to</h2>&nbsp;<a href="https://greensock.com/docs/v2/TweenMax/static.to()" target="_blank"><i class="material-icons purple">open_in_new</i></a></div><div class="mdl-card__supporting-text mdl-card--border">[static] Static method for creating a TweenMax instance that animates to the specified destination values (from the current values).</div><div class="mdl-grid"><div class="mdl-cell mdl-cell--6-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder=".selector" value="svg > g > g" data-get="selector"></div></div></div><div class="mdl-cell mdl-cell--2-col"><div class="mdl-card__actions"><div class="mdc-text-field"><input type="number" class="mdl-textfield__input number" placeholder="speed" min="0" value="1.5" data-get="speed"></div></div></div><hr></div><div class="keyplace" data-place="key"><div class="mdl-card__actions mdl-card--border"><div class="mdl-card__actions"><span>force3D:</span> &nbsp;<div class="mdl-textfield__input w100p tc" data-placeholder="true/false" contenteditable>true</div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)"><i class="material-icons">clear</i></button></div></div><div class="mdl-card__actions mdl-card--border"><div class="mdl-card__actions"><span>yoyo:</span> &nbsp;<div class="mdl-textfield__input w100p tc" data-placeholder="true/false" contenteditable>false</div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)"><i class="material-icons">clear</i></button></div></div><div class="mdl-card__actions mdl-card--border"><div class="mdl-card__actions"><span>repeat:</span> &nbsp;<div class="mdl-textfield__input w100p tc" data-placeholder="-1" contenteditable>-1</div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)"><i class="material-icons">clear</i></button></div></div><div class="mdl-card__actions mdl-card--border"><div class="mdl-card__actions"><span>repeatDelay:</span> &nbsp;<div class="mdl-textfield__input w100p tc" data-placeholder="0" contenteditable>0</div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)"><i class="material-icons">clear</i></button></div></div><div class="mdl-card__actions mdl-card--border"><div class="mdl-card__actions"><span>ease:</span> &nbsp;<div class="mdl-textfield__input w100p tc" data-placeholder="Power0.easeOut" contenteditable>Power0.easeOut</div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)"><i class="material-icons">clear</i></button></div></div></div><div class="mdl-card__actions mdl-card--border"><div class="mdc-text-field"><input type="text" class="mdl-textfield__input" placeholder="x, y, fill, borderRadius..." data-enter="click"></div><div class="mdl-layout-spacer"></div><button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-action="addKey" onClick="addKey(this)"><i class="material-icons">control_point</i></button></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon" onClick="cloneHub(this)"><i class="material-icons">file_copy</i></button><button class="mdl-button mdl-button--icon" onClick="deleteHub(this)"><i class="material-icons">delete</i></button></div></div>';
      
      // append hub
      $("[data-grab=hubs]").append(hubStr);
      draggableHub();
      
      // add key via enterkey
      $("[data-enter=click]").on("keydown", function(e) {
        // look for window.event in case event isn't passed in
        e = e || window.event;
        if (e.keyCode == 13) {
          this.parentNode.parentNode.querySelector("[data-action=addKey]").click();
          return false;
        }
        return true;
      });
    }
  }
});

// delete a hub
function deleteHub(e) {
  $(e).parent().parent().remove();
}

// add key
function addKey(e) {
  if (e.hasAttribute("data-disabled")) {
    alertify.log('Not available in demos');
  } else {
    var val = $(e).parent().find("input").val();
    if (!val.replace(/ /g, "")) {
      alertify.error("Error: Value is empty!");
    } else {
      val = val.replace(/ /g, "");
      $(e).parent().prev().append('<div class="mdl-card__actions mdl-card--border">\n<div class="mdl-card__actions"><span>'+ val +':</span> &nbsp;\n<div class="mdl-textfield__input w100p tc" contenteditable></div>\n<div class="mdl-layout-spacer"></div>\n<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick="deleteKey(this)">\n<i class="material-icons">clear</i>\n</button>\n</div>\n</div>');
      $(e).parent().find("input").val("");
      $(e).parent().prev().scrollTop($(e).parent().prev().prop("scrollHeight"));
  //    $(window).scrollTop($(document).height());
    }
  }
}
$("[data-enter=click]").on("keydown", function(e) {
  // look for window.event in case event isn't passed in
  e = e || window.event;
  if (e.keyCode == 13) {
    this.parentNode.parentNode.querySelector("[data-action=addKey]").click();
//    $(this).parent().parent().find("[data-action=addKey]").trigger("click");
    return false;
  }
  return true;
});

// delete key
function deleteKey(e) {
  $(e).parent().parent().remove();
}

// clone a hub
function cloneHub(e) {
  $(e).parent().parent().clone().appendTo(".mdl-layout__content [data-grab=hubs]");
  draggableHub();

  $("[contenteditable]").blur(function(){
    var $element = $(this);
    if ($element.html().length && !$element.text().trim().length) {
      $element.empty();
    }
  });
}

// make hub draggable
function draggableHub() {
  $("[data-action=draggable]").draggable({
    handle: "[data-action=move]",
    stack: $("[data-action=draggable]")
  });
}
draggableHub();

// for contenteditable placeholders
$("[contenteditable]").blur(function(){
  var $element = $(this);
  if ($element.html().length && !$element.text().trim().length) {
    $element.empty();
  }
});

// hide Hubs
$("[data-action=hideHubs]").click(function() {
  var elm = $("[data-action=hideHubs] > .material-icons");

  if (elm.text() === "check_box") {
    // show see through icon
    elm.text("check_box_outline_blank");
    
    // hide hubs
    $("[data-grab=hubs] > div").hide();
  } else {
    // reset icon
    elm.text("check_box");
    
    // show hubs
    $("[data-grab=hubs] > div").show();
  }
});

// export files
function getCode() {
  // clear full code string
  htmlCode = $(".vector").html();
  jsCode = "";

  var hubs = document.querySelectorAll("[data-grab=hubs] > div");
  for (var i = 0; i < hubs.length; i++) {
    var hubSelector = hubs[i].querySelector("[data-get=selector]").value;
    var hubSpeed = hubs[i].querySelector("[data-get=speed]").value;
    var hubKeyStr = hubs[i].querySelector("[data-place=key]").textContent.toString().replace(/ /g, "").replace(/\n/g, "").replace(/clear/g, ",\n");
    var hubKeys = hubKeyStr.substr(0, hubKeyStr.length - 2);
    var codeStr = 'TweenMax.to(".vector '+ hubSelector +'", '+ hubSpeed +', {\n'+ hubKeys +'\n});\n\n';
    jsCode += codeStr;
  }
}
function saveCode(filename) {
  JSZipUtils.getBinaryContent("zips/gsap-public.zip", function(err, data) {
    if(err) {
      throw err // or handle err
    }

    var zip = new JSZip();

    // Put all application files in subfolder for shell script
    var zipFolder = zip.folder("libraries");
    zipFolder.load(data);

    zip.file("index.html", '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1">\n  </head>\n  <body>\n    <div class="vector">'+ htmlCode +'</div>\n    \n    <script src="libraries/gsap-public/minified/gsap.min.js"></script>\n    <script src="libraries/gsap-public/minified/EasePack.min.js"></script>\n    <script src="libraries/gsap-public/minified/MotionPathPlugin.min.js"></script>\n    <script src="libraries/gsap-public/minified/TextPlugin.min.js"></script>\n    <script src="libraries/gsap-public/minified/CSSRulePlugin.min.js"></script>\n    <script src="js/animation.js"></script>\n  </body>\n</html>');
    zip.file("js/animation.js", jsCode);
    var content = zip.generate({type:"blob"});
    saveAs(content, filename + ".zip");
  });
}
function saveDialog() {
  swal({
    title: 'File name below!',
    input: 'text',
    inputPlaceholder: ".zip is added on save",
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true
  }).then((result) => {
    if (result.value) {
      getCode();
      saveCode(result.value);

      swal(
        'Yay!',
        'You\'re GreenSock Animation was successfully saved!',
        'success'
      );
    } else {
      swal(
        'Oops!',
        console.error().toString(),
        'error'
      );
    }
  });
}
$("[data-export=zip]").click(function() {
  // if animation is playing stop it
  var elm = $("[data-play=animation] .material-icons");
  if (elm.text() === "stop") {
    // stop animation from playing...
    $("[data-play=animation]").trigger("click");
    saveDialog();
  } else {
    saveDialog();
  }
});
$("[data-export=gif]").click(function() {
  alertify.log("coming soon...");
});
$("[data-export=vid]").click(function() {
  alertify.log("coming soon...");
});

// alert the user feature is coming soon
$("[data-action=comingsoon]").click(function() {
  alertify.log("coming soon...");
  return false;
});