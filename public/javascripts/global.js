// Userlist data array for filling in info box
var lessonListData = [];
var lastObject;
var temp=0;
var object;
var jsonNumerator=0;
var selector=0;

// DOM Ready =============================================================
$(document).ready(function() {


    //github initializer

    // Populate the user table on initial page load
    populateTable();

    $(window).on("load",showUserInfoWhenStart)

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddLesson').on('click',addLesson);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteLesson);
    $('#userList table tbody').on('click', 'td a.linkupdateuser', updateLesson);
    $('#jsonGoster').on('click',showAsJson);
    $('#xmlGoster').on('click',showAsXml);


    //güncellenecek sütundan çıkılınca
    $('#dersKodu').on('keyup',updateLesson);
    $('#dersAdi').on('keyup',updateLesson);
    $('#dersIcerik').on('keyup',updateLesson);



});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/lessons/lessonList', function( data ) {

        lessonListData = data;
        if(temp==0)
        { object=lessonListData[2];
        temp++;}
        else
        { object=lastObject;}
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            if(this._id==object._id) {
                tableContent += '<tr class="success">';
                //tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.siraNo + '">' + this.dersKodu + '</a></td>';
                tableContent += '<td>' + this.siraNo + '</td>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.dersKodu + '">' + this.dersKodu + '</a></td>';
                //tableContent += '<td>' + this.dersKodu + '</td>';
                tableContent += '<td>' + this.dersAdi + '</td>';
                tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Sil</a></td>';
                tableContent += '</tr>';
                lastObject=this;

            }
            else{
                tableContent += '<tr">';
                //tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.siraNo + '">' + this.dersKodu + '</a></td>';
                tableContent += '<td>' + this.siraNo + '</td>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.dersKodu + '">' + this.dersKodu + '</a></td>';
                //tableContent += '<td>' + this.dersKodu + '</td>';
                tableContent += '<td>' + this.dersAdi + '</td>';
                tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">Sil</a></td>';

                tableContent += '</tr>';
            }
        });

        // Inject the whole content string into our existing HTML table
        //userlist isimli elamanın tablosunun tbody(table body) kısmını doldurmaya yarayan jquery kodu.
        $('#userList table tbody').html(tableContent);
        jsonNumerator++;
        if(selector==1)
        {showAsJsonWithoutEvent();}
        else if (selector==2)
        {showAsXmlWithoutEvent();}



    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisLesson = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = lessonListData.map(function(arrayItem) { return arrayItem.dersKodu; }).indexOf(thisLesson);


    // Get our User Object
    var thisLessonObject = lessonListData[arrayPosition];
    lastObject=thisLessonObject;

    //Populate Info Box
    $('#siraNo').val(thisLessonObject.siraNo);
    $('#dersKodu').val(thisLessonObject.dersKodu);
    $('#dersAdi').val(thisLessonObject.dersAdi);
    $('#dersIcerik').val(thisLessonObject.dersIcerik);
    populateTable();
    if($('#comment').val()!=""){
        if(selector==1)
        {showAsJsonWithoutEvent();}
        else if (selector==2)
        {
            showAsXmlWithoutEvent();
        }

    }

};
function showUserInfoWhenStart() {

    // Prevent Link from Firing



    // Get Index of object based on id value
    var arrayPosition =2



    // Get our User Object
    var thisLessonObject = lessonListData[arrayPosition];
    lastObject= thisLessonObject;

    //Populate Info Box
    $('#siraNo').val(thisLessonObject.siraNo);
    $('#dersKodu').val(thisLessonObject.dersKodu);
    $('#dersAdi').val(thisLessonObject.dersAdi);
    $('#dersIcerik').val(thisLessonObject.dersIcerik);

};



function updateLesson (event) {
    event.preventDefault();

    var errorCount=0;
    $('#addLesson fieldset form input').each(function(index, val){
        if($(this).val()=== '') {errorCount++;}
    });


    if(errorCount>0){
        var updatedLesson={
            'siraNo':$('#siraNo').val(),
            'dersKodu':$('#dersKodu').val(),
            'dersAdi':$('#dersAdi').val(),
            'dersIcerik':$('#dersIcerik').val()

        }

        $.ajax({
            type:   'PUT',
            data:   updatedLesson,
            url:    '/lessons/updatelesson/'+ lastObject._id,
            dataType:   'JSON'


        }).done(function (response) {


        if(response.msg===''){

            $('#addLesson fieldset form input').val();
            if($('#comment').val()!=""){
                if(selector==1)
                {showAsJsonWithoutEvent();}
                else if (selector==2){
                    showAsXmlWithoutEvent();
                }

            }
            populateTable();


        }


        else{

            alert('Error: ' +response.msg);



        }
        
    });



    }
    else {

        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;

    }
    
}
function addLesson (event) {
    event.preventDefault();

    var errorCount=0;
    $('#addLesson fieldset form input').each(function(index, val){
        if($(this).val()=== '') {errorCount++;}
    });


    if(errorCount===0){
        var newLesson={
            'siraNo':$('#addLesson fieldset form input#inputsiraNo').val(),
            'dersKodu':$('#addLesson fieldset form input#inputdersKodu').val(),
            'dersAdi':$('#addLesson fieldset form input#inputdersAdi').val(),
            'dersIcerik':$('#addLesson fieldset form input#inputdersIcerik').val()

        }

        $.ajax({
            type:   'POST',
            data:   newLesson,
            url:    '/lessons/addlesson',
            dataType:   'JSON'


        }).done(function (response) {


            if(response.msg===''){

                $('#addLesson fieldset form input').val();


                populateTable();


            }


            else{

                alert('Error: ' +response.msg);



            }

        });



    }
    else {

        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;

    }

}


function deleteLesson(event) {

    event.preventDefault();


    var confirmation=confirm('Silmek İstediğinize Emin misiniz?');

    if(confirmation===true){
        $.ajax({
            type:   'DELETE',
            url:    '/lessons/deletelesson/' + $(this).attr('rel')

        }).done(function (response) {

            if(response.msg===''){

            }
            else
            {
                alert('Error:' +response.msg);
            }


            populateTable();
            
        });



    }


    else {

        return false;



    }


    
};
function showAsJson(event){

    event.preventDefault();
    selector=1;

    if (jsonNumerator==0){
        jsonNumerator++;
    }
    else {
        var JsonData={
            'siraNo':$('#siraNo').val(),
            'dersKodu':$('#dersKodu').val(),
            'dersAdi':$('#dersAdi').val(),
            'dersIcerik':$('#dersIcerik').val()
        }



        var str = JSON.stringify(JsonData, 2, null);
        $('#comment').val(str);
    }


}
function showAsJsonWithoutEvent(){


    if (jsonNumerator==0){
        jsonNumerator++;
    }
    else {
        var JsonData={
            'siraNo':$('#siraNo').val(),
            'dersKodu':$('#dersKodu').val(),
            'dersAdi':$('#dersAdi').val(),
            'dersIcerik':$('#dersIcerik').val()
        }



        var str = JSON.stringify(JsonData, 2, null);
        $('#comment').val(str);
    }



}
function showAsXml(event){

    event.preventDefault();

    selector=2;
    if (jsonNumerator==0){
        jsonNumerator++;
    }
    else {

        var x2js = new X2JS();
        var JsonData = {
            'siraNo': $('#siraNo').val(),
            'dersKodu': $('#dersKodu').val(),
            'dersAdi': $('#dersAdi').val(),
            'dersIcerik': $('#dersIcerik').val()
        }
        var xmlStr = x2js.json2xml_str(JsonData);
        $('#comment').val(xmlStr);


    }
}

function showAsXmlWithoutEvent(){

    if (jsonNumerator==0){
        jsonNumerator++;
    }
    else {

        var x2js= new X2JS();
        var JsonData={
            'siraNo':$('#siraNo').val(),
            'dersKodu':$('#dersKodu').val(),
            'dersAdi':$('#dersAdi').val(),
            'dersIcerik':$('#dersIcerik').val()
        }
        var xmlStr=x2js.json2xml_str(JsonData);
        $('#comment').val(xmlStr);
    }





}
