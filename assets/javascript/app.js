//display a list of buttons that will allow you to generate a list of 10 gifs and display them to the user
//provide a form so that the user is able to add buttons of their choice to the list of buttons
//the gifs will be stopped first and once the user clicks on them they will be able to trigger the gif to start moving

//initialize array of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbill", "pygmy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];

// giphy api: http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5
var queryUrl = "https://api.giphy.com/v1/gifs/search?q=";

//movie url: http://www.omdbapi.com/?t=octopus
var movieQueryUrl = "https://www.omdbapi.com/?t=";

//category name
var cName;

//gif container
var gifDiv;

//gif image container
var imageStill;

//container that holds gif rating and title
var gifDataDiv;

//creates p to hold gif data
var p;

//creates strong tag that holds the labels to the gif data
var bold;

//access gif images from the api
var resultsImg;

//will hold gif rating data
var rating;

//will hold gif title data
var title;

//download gif
var downloadGif;

//current category
var currCategory;

//current offset
var offsetCount = 0;

//adds on to the list of animals
function addAnimal() {
    //make a list of links based on the list of topics
    for (var i = 0; i < topics.length; i++) {
        //initialize category name
        let cName = topics[i];
        //initialize category to the topics inside the array
        //changes spaces to + it helps to build the url
        let tempCategory = topics[i].replace(/\s+/g, '+');

        //make a dropdown item to be added to animal dropdown
        var listItem = $("<a class=\"dropdown-item\" href=\"#\">" + topics[i] + "</a>");

        //remove click handler
        $(listItem).off("click");

        //list item onclick function
        $(listItem).click(function () {
            //initialize currCategory
            currCategory = tempCategory;

            //set offset to 0 when new category is clicked
            offsetCount = 0;

            //build gif url
            //let is necessary given scope issues
            let topicUrl = makeGifUrl();

            //build movie url
            let movieTopicUrl = makeMovieUrl();

            //empty columns
            $("#gifColumns").empty();

            //update category name in html
            $("#categoryName").text(cName);

            //initializes the topics to be used in the dropdown
            callApi(topicUrl, movieTopicUrl);
        });

        //add list of topics onto the html
        $(".dropdown-menu").append(listItem);
    }
}
//loads jQuery after the document is already loaded
$(document).ready(function () {
    //initialize dropdown list
    addAnimal();

    //initialize currCategory
    currCategory = "animals";

    //update category name in html
    $("#categoryName").text(currCategory);

    //set offset to 0 
    offsetCount = 0;

    //loads a list of 10 animals
    callApi(makeGifUrl(), makeMovieUrl());

    //remove click handler
    $("#viewMore").off("click");

    //add more 10 more gifs
    $("#viewMore").click(function (event) {
        //update offset count
        offsetCount += 10;

        //loads a list of 10 animals
        callApi(makeGifUrl(), makeMovieUrl());
    });
});

//builds gif url
function makeGifUrl() {
    //set up  url
    return queryUrl + currCategory + "&api_key=GNoX2M7isIvDEl7iH6lwnneiUlpYTSVa&limit=10&offset=" + offsetCount;
}

//builds movie url
function makeMovieUrl() {
    //set up  url
    return movieQueryUrl + currCategory + "&apikey=332cac25";
}
//makes requests to the api's
function callApi(gifUrl, movieUrl) {
    //put ajax call here
    console.log(gifUrl + " " + movieUrl);

    //make call to the gif api
    $.ajax({
        url: gifUrl,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        // Storing an array of results in the results variable
        var results = response.data;

        //go through the data of the giphy object
        for (var i = 0; i < results.length; i++) {
            //create template for the gif to be displayed
            // Creating a div for the gif
            gifDiv = $("<div class=\"card text-center border border-dark shadow-lg\">");

            //display gif image
            imageStill = $("<img class=\"card-img-top img-fluid border-bottom border-dark gif\"/>");

            //create a div to hold the ratings and title of the gif
            gifDataDiv = $("<div class=\"card-body\">");

            //display rating
            p = $("<p>");

            //add bold tag
            bold = $("<strong>");

            //access gif images
            resultsImg = results[i].images;

            //download url
            let downloadUrl = resultsImg.downsized.url;

            //slug name
            let slug = results[i].slug;

            //add download button
            downloadGif = $("<a href=\"#\" class=\"btn btn-primary\">");

            //accesss gif ratings
            rating = results[i].rating;

            //access title of the gif
            title = results[i].title;

            //build gif columns and show in the html
            initGif("#gifColumns", gifDiv, gifDataDiv, p, bold, imageStill, resultsImg, rating, title, downloadGif);

            //download click so the user can have access to the gif from the computer
            downloadGif.click(function () {

                var x = new XMLHttpRequest();
                x.open("GET", downloadUrl, true);
                x.responseType = 'blob';
                x.onload = function (e) { download(x.response, slug + ".gif", "image/gif"); }
                x.send();
            });
        }
        //remove click handler
        $(".gif").off("click");

        //have the gif animate after the user has clicked it
        $(".gif").on("click", function () {
            //initiate the data state of the current gif
            var state = $(this).attr("data-state");
            // If the clicked image's state is still, update its src attribute to what its data-animate value is.
            if (state === "still") {
                //set the src of the image to be its animated url
                $(this).attr("src", $(this).attr("data-animate"));
                //set data state to animate
                $(this).attr("data-state", "animate");
            } else {
                //set the scr of the image to be its still url
                $(this).attr("src", $(this).attr("data-still"));
                //set data state to still
                $(this).attr("data-state", "still");
            }
        });
    });

    //make call to movie api
    $.ajax({
        url: movieUrl,
        method: "GET",
    }).then(function (response) {
        //print result
        console.log(response);

        //check if there is a movie
        if (response.Response === "False") {
            //access error from response
            $("#movieNotFound").text(response.Error);

            //remove display class
            $("#movieNotFound").removeClass("d-none");

            //add display class
            $("#movieFound").addClass("d-none");
        } else {
            //remove display class
            $("#movieFound").removeClass("d-none");

            //add display class
            $("#movieNotFound").addClass("d-none");
        }

        //access the first movie and append to the html
        //movie title
        $("#movieTitle").text(response.Title);

        //release date
        $("#year").text(response.Year);
    });
}

//remove click handler
$("#runAddAnimal").off("click");

//add animal to the topics array with the submit click function
$("#runAddAnimal").click(function (event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    //target input from add animal input box and add it to the topics array
    topics.push($("#addAnimal").val().trim());
    // console.log($("#addAnimal").val().trim());

    //clear text box
    $("#addAnimal").val("");

    //empty dropdown menu
    $(".dropdown-menu").empty();

    //add onto the list of animals
    addAnimal();
});

//initializes gif 
function initGif(row, gifDiv, gifDataDiv, p, bold, imageStill, resultsImg, rating, title) {
    //adds in the col-sm-3
    $(row).append(gifDiv);

    //adds src content to img tag
    imageStill.attr("src", resultsImg.fixed_height_still.url);

    //sets still data state
    imageStill.attr("data-still", resultsImg.fixed_height_still.url);

    //sets animate data state
    imageStill.attr("data-animate", resultsImg.fixed_height.url);

    //sets animate data state
    imageStill.attr("data-state", "still");

    //adds gif image
    gifDiv.append(imageStill);

    //adds gif text below image
    gifDiv.append(gifDataDiv);

    //adds rating text
    bold.text("Rating: ");

    //adds rating value
    p.text(rating);

    //adds <strong> tag after <p> tag
    p.prepend(bold);

    //adds rating p tag
    gifDataDiv.append(p);

    //adds title p tag
    gifDataDiv.append(p.clone().text(title).prepend(bold.clone().text("Title: ")));

    //adds download button
    gifDataDiv.append(downloadGif.text("Download"));
}