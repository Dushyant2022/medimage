
var ServerUrl = "http://travel.demoproject.info/api/process";
var fileName = "data.json";
//The directory to store data
var store;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        switch (device.platform) {
            case "Android":
                store = cordova.file.externalDataDirectory;
                break;
            case "iOS":
                store = cordova.file.documentsDirectory;
                break;
        }
        
        //Check for the file.
        console.log(store);
        window.resolveLocalFileSystemURL(store + fileName, checkfordatafile, downloadFile);
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};

app.initialize();

function fail(evt){
    alert(evt.target.error.code);
}

function onFileSystemSuccess(fileSystem) {
    console.log(fileSystem.name);
}
function checkfordatafile(){

}

function downloadFile(){
    $("ons-progress-circular.loading-circle").show();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
       var fileTransfer = new FileTransfer();
       fileTransfer.download(
          ServerUrl+"/data.json",
          store + fileName,
          function (entry) {
             $("ons-progress-circular.loading-circle").hide();
             alert("Synced to server successfully!!");
          },
          function (error) {
             $("ons-progress-circular.loading-circle").hide();
              alert("download error source " + error.source);
              alert("download error target " + error.target);
              alert("upload error code" + error.code);
          }
       );
    });
}

/*jQuery Core Code*/
$(document).ready(function() {

    $("ons-progress-circular.loading-circle").hide();
    $("#data").on("keyup",function(){
        var str1 = $(this).val();
        var str2 = "#";
        if(str1.indexOf(str2) != -1){
            $("ons-progress-circular.loading-circle").show();
            $.getJSON(store+"/data.json", function(result){
                $(".add_to_input").remove();
                $.each(result.defaultWords, function(index, value){
                    string1 = str1.split('#')[1];
                    if(value.toLowerCase().indexOf(string1.toLowerCase()) != -1){
                        var content = "<span class='add_to_input' onClick='add_to_function(this);' value='"+value+"'>" + value + "</span>";
                        $(".dropdown-content").append(content);
                    }
                });
            });
            $(".dropdown-content").addClass("expanded");  
            $("ons-progress-circular.loading-circle").hide();  
        }else{
            $(".add_to_input").remove();
        }
    });

    
    
});
/*OnsenUi JS*/
function add_to_function(elem){
    var str = elem.getAttribute("value");
    var s = $("#data").val().substring(0, $("#data").val().indexOf('#'));
    $("#data").val(s+"#"+str);
    $(".dropdown-content").removeClass("expanded");
}

function insert_patient(){
    var write_json_data;
    $.getJSON("data2.json", function (data) {
            var write_json_data = data.defaultWords;
            write_json_data.push("new");
        });
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

        fs.root.getFile(store + "data.json", { create: true, exclusive: false }, function (fileEntry) {

            console.log("fileEntry is file?" + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            writeFile(fileEntry, write_json_data);

        }, onErrorCreateFile);

    }, onErrorLoadFs);

    var fd = new FormData();
    var postData = $(this).serialize();
    /*$("ons-progress-circular.loading-circle").show();
    $.ajax({
        type: 'POST',
        data:{'user_data':$("#data").val()},
        dataType:'json',
        cache:false,
        url: 'http://travel.demoproject.info/api/process/process.php',
        success: function(result){
            $("ons-progress-circular.loading-circle").hide();
            alert(result.msg);
        },
        error: function(){
            $("ons-progress-circular.loading-circle").hide();
            alert('There was an error adding your comment');
        }
    });*/
}

function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}
$(function(){
    // Initialization code

});