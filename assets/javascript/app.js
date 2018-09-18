//display a list of buttons that will allow you to generate a list of 10 gifs and display them to the user
//provide a form so that the user is able to add buttons of their choice to the list of buttons
//the gifs will be stopped first and once the user clicks on them they will be able to trigger the gif to start moving

//initialize array of topics
var topics = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbill", "pygmy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];

// giphy api: http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5
var queryUrl = "https://api.giphy.com/v1/gifs/search?q=";


//make a list of links based on the list of topics
for (var i = 0; i < topics.length; i++) {
    //changes spaces to + it helps to build the url
    //build topic url
    //let is necessary given scope issues
    let topicUrl = queryUrl + topics[i].replace(/\s+/g, '+') + "&api_key=GNoX2M7isIvDEl7iH6lwnneiUlpYTSVa&limit=10";

    //make a dropdown item to be added to animal dropdown
    var listItem = $("<a class=\"dropdown-item\" href=\"#\">" + topics[i] + "</a>");

    //list item onclick function
    $(listItem).click(function () {
        //put ajax call here
        console.log(topicUrl);
        //make call to the api
        $.ajax({
            url: topicUrl,
            method: "GET",
        }).then(function (response) {
            console.log(response);
            // Storing an array of results in the results variable
            var results = response.data;
            //empty rows
            $("#firstRow").empty();
            $("#secondRow").empty();
            $("#thirdRow").empty();

            //go through the data of the giphy object
            for (var i = 0; i < results.length; i++) {
                //create template for the gif to be displayed
                // Creating a div for the gif
                var gifDiv = $("<div class=\"col-sm-3\">");

                //display rating
                var p = $("<p>");
                //console.log(results[i].rating);

                //display gifs
                var imageStill = $("<img class=\"img-fluid gif\"/>");

                //access gif images
                var resultsImg = results[i].images;

                //accesss gif ratings
                var rating = results[i].rating;

                //the first 4 (index: 0,1,2,3) will be saved on the firstRow
                if (i <= 3) {
                    //build gif and show in the html
                    initGif("#firstRow", gifDiv, p, imageStill, resultsImg,rating);
                } else if (4 <= i && i <= 7) { //the second 4 (index: 4,5,6,7will be saved on the secondRow
                    //build gif and show in the html
                    initGif("#secondRow", gifDiv, p, imageStill, resultsImg,rating);
                } else if (i <= 9) { //the third 4 (index: 8,9) will be saved on the thirdRow
                    //build gif and show in the html
                    initGif("#thirdRow", gifDiv, p, imageStill, resultsImg,rating);
                }
            }
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
    });

    //add list of topics onto the html
    $(".dropdown-menu").append(listItem);
}

//initializes gif 
function initGif(row, gifDiv, p, imageStill, resultsImg, rating){
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

    //adds gif
    gifDiv.append(imageStill);

    //adds p tag
    gifDiv.append(p);

    //adds content to p tag
    p.text("Rating: " + rating);
}