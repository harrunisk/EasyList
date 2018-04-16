// lesson list data array for filling in info box
var lessonListData = [];
var lastObject;
var temp=0;
var object;
var jsonNumerator=0;
var selector=0;

// DOM Ready =============================================================
$(document).ready(function() {


    //github initializer

    // Populate the lesson table on initial page load
    populateTable();

    $(window).on("load",showLessonInfoWhenStart)

    // Lesson link click
    $('#lessonList table tbody').on('click', 'td a.linkshowLesson', showLessonInfo);
    $('#btnAddLesson').on('click',addLesson);
    $('#lessonList table tbody').on('click', 'td a.linkdeletelesson', deleteLesson);
    $('#jsonFormat').on('click',showAsJson);
    $('#xmlFormat').on('click',showAsXml);


    //keyup functions
    $('#courseCode').on('keyup',updateLesson);
    $('#courseName').on('keyup',updateLesson);
    $('#courseContent').on('keyup',updateLesson);



});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/lessons/lessonList', function( data ) {

        lessonListData = data;
        if(temp==0 || lessonListData.length==1)
        { object=lessonListData[0];
        temp++;}
        else
        { object=lastObject;}
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            if(this._id==object._id) {
                tableContent += '<tr class="success">';
                //tableContent += '<td><a href="#" class="linkshowLesson" rel="' + this.sequenceNumber + '">' + this.courseCode + '</a></td>';
                tableContent += '<td>' + this.sequenceNumber + '</td>';
                tableContent += '<td><a href="#" class="linkshowLesson" rel="' + this.courseCode + '">' + this.courseCode + '</a></td>';
                //tableContent += '<td>' + this.courseCode + '</td>';
                tableContent += '<td>' + this.courseName + '</td>';
                tableContent += '<td><a href="#" class="linkdeletelesson" rel="' + this._id + '">Delete Course</a></td>';
                tableContent += '</tr>';
                lastObject=this;

            }
            else{
                tableContent += '<tr">';
                //tableContent += '<td><a href="#" class="linkshowLesson" rel="' + this.sequenceNumber + '">' + this.courseCode + '</a></td>';
                tableContent += '<td>' + this.sequenceNumber + '</td>';
                tableContent += '<td><a href="#" class="linkshowLesson" rel="' + this.courseCode + '">' + this.courseCode + '</a></td>';
                //tableContent += '<td>' + this.courseCode + '</td>';
                tableContent += '<td>' + this.courseName + '</td>';
                tableContent += '<td><a href="#" class="linkdeletelesson" rel="' + this._id + '">Delete Course</a></td>';
                tableContent += '</tr>';
            }
        });

        // Inject the whole content string into our existing HTML table
        //lessonlist isimli elamanın tablosunun tbody(table body) kısmını doldurmaya yarayan jquery kodu.
        $('#lessonList table tbody').html(tableContent);
        jsonNumerator++;
        if(selector==1)
        {showAsJsonWithoutEvent();}
        else if (selector==2)
        {showAsXmlWithoutEvent();}



    });
};

// Show Lesson Info
function showLessonInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve lesson from link rel attribute
    var thisLesson = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = lessonListData.map(function(arrayItem) { return arrayItem.courseCode; }).indexOf(thisLesson);


    // Get our Lesson Object
    var thisLessonObject = lessonListData[arrayPosition];
    lastObject=thisLessonObject;

    //Populate Info Box
    $('#sequenceNumber').val(thisLessonObject.sequenceNumber);
    $('#courseCode').val(thisLessonObject.courseCode);
    $('#courseName').val(thisLessonObject.courseName);
    $('#courseContent').val(thisLessonObject.courseContent);
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
function showLessonInfoWhenStart() {

    // Prevent Link from Firing




    if(lessonListData.length!=0) {

        // Get Index of object based on id value
        var arrayPosition = 0
        // Get our lesson Object
        var thisLessonObject = lessonListData[arrayPosition];
        lastObject = thisLessonObject;

        //Populate Info Box
        $('#sequenceNumber').val(thisLessonObject.sequenceNumber);
        $('#courseCode').val(thisLessonObject.courseCode);
        $('#courseName').val(thisLessonObject.courseName);
        $('#courseContent').val(thisLessonObject.courseContent);
    }

};



function updateLesson (event) {
    event.preventDefault();

    var errorCount=0;
    $('#addLesson fieldset form input').each(function(index, val){
        if($(this).val()=== '') {errorCount++;}
    });


    if(errorCount>0){
        var updatedLesson={
            'sequenceNumber':$('#sequenceNumber').val(),
            'courseCode':$('#courseCode').val(),
            'courseName':$('#courseName').val(),
            'courseContent':$('#courseContent').val()

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
            'sequenceNumber':$('#addLesson fieldset form input#inputsequenceNumber').val(),
            'courseCode':$('#addLesson fieldset form input#inputcourseCode').val(),
            'courseName':$('#addLesson fieldset form input#inputcourseName').val(),
            'courseContent':$('#addLesson fieldset form input#inputcourseContent').val()

        }

        $.ajax({
            type:   'POST',
            data:   newLesson,
            url:    '/lessons/addlesson',
            dataType:   'JSON'


        }).done(function (response) {


            if(response.msg===''){

                $('#addLesson fieldset form input').val();

                    $('#addLesson fieldset form input#inputsequenceNumber').val(''),
                    $('#addLesson fieldset form input#inputcourseCode').val(''),
                    $('#addLesson fieldset form input#inputcourseName').val(''),
                    $('#addLesson fieldset form input#inputcourseContent').val('')





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


    var confirmation=confirm('Are you sure you want to delete?');

    if(confirmation===true){
        $.ajax({
            type:   'DELETE',
            url:    '/lessons/deletelesson/' + $(this).attr('rel')

        }).done(function (response) {

            if(response.msg===''){

                if (lessonListData.length==1)
                {
                    $('#sequenceNumber').val(''),
                    $('#courseCode').val(''),
                    $('#courseName').val(''),
                    $('#courseContent').val('')



                }
                else{

                    showLessonInfoWhenStart()
                }

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
            'sequenceNumber':$('#sequenceNumber').val(),
            'courseCode':$('#courseCode').val(),
            'courseName':$('#courseName').val(),
            'courseContent':$('#courseContent').val()
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
            'sequenceNumber':$('#sequenceNumber').val(),
            'courseCode':$('#courseCode').val(),
            'courseName':$('#courseName').val(),
            'courseContent':$('#courseContent').val()
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
            'sequenceNumber': $('#sequenceNumber').val(),
            'courseCode': $('#courseCode').val(),
            'courseName': $('#courseName').val(),
            'courseContent': $('#courseContent').val()
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
            'sequenceNumber':$('#sequenceNumber').val(),
            'courseCode':$('#courseCode').val(),
            'courseName':$('#courseName').val(),
            'courseContent':$('#courseContent').val()
        }
        var xmlStr=x2js.json2xml_str(JsonData);
        $('#comment').val(xmlStr);
    }





}
