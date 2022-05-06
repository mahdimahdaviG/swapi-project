// Midterm Project of Internet Engineering - Spring 2022
// Amirkabir University of Technology, Faculty of Computer Engineering 
// By Mahdi Mahdavi - 9831309

const mainContainer = document.getElementById("main-container");
const starshipInfoContainer = document.getElementById("starship-info-container");
const starshipButtons = document.querySelectorAll('.starship-btn');
const backButton = document.querySelectorAll('.back-to-movies-btn')
const cards = document.querySelectorAll('.card');
const headerText = document.getElementById("text");
const nthEpisodeText = document.getElementById("nth-episode-text");
const starshipsTitleContainers = document.querySelectorAll(".starship-title-container");
const starshipModelContainer = document.querySelectorAll(".starships-model-container");
const starshipDetailsButtons = document.querySelectorAll(".starship-details-btn");
const starshipsNameText = document.getElementById("starship-name-text");
const starshipDetailsContainer = document.getElementById("starship-details-container");
const detailsText = document.querySelector("#details");

const starshipUrls = [0,0,0,0,0,0];

//function for hiding elemnts
function hideElement(element)
{
    element.style.visibility = 'hidden';
}
//function for showing elemnts
function showElement(element)
{
    element.style.visibility = 'visible';
}
// A combined version of showElement and hideElement function
function swithContainer(showingElement, hidingElement)
{
    showElement(showingElement);
    hideElement(hidingElement);
}

// getting informations and showing them to user
async function setCardInfo(card)
{
    //getting episode id for sending request.
    let episodeId = card.getAttribute("name");

    // handling request and storing desired information into movieInfo.
    let response = await fetch(`https://swapi.dev/api/films/${episodeId}`);
    let json = await response.json();
    let movieInfo = [json.title, json.episode_id, json.release_date, json.starships];

    // storing starships information URLs in a global array named "starshipsURLs".
    let index = json.episode_id - 1;
    starshipUrls[index] = json.starships

    // assigning an attribute named "epiodeid" to clicked button for further use.
    starshipBtn = card.childNodes[7];
    starshipBtn.setAttribute("episodeId", json.episode_id)

    // Showing received information to user.
    fillMovieInfo(card, movieInfo);
}

// after getting information, here we set them and display them
function fillMovieInfo (card, info)
{
    let movieTitle = info[0];
    let movieEpisodeId = info[1];
    let movieReleaseDate = info[2];

    const titleText = card.childNodes[1];
    const episodeIdText = card.childNodes[3];
    const releaseDateText = card.childNodes[5];

    titleText.innerHTML = movieTitle;
    episodeIdText.innerHTML = "Episode " + movieEpisodeId;
    releaseDateText.innerHTML = "Released on " + movieReleaseDate;
}

// after clicking on "Starships" button, we list the starships are in a movie
async function setStarshipsList(episodeId)
{   
    //specifing that the list that is dislpyed, corresponds to which movie
    nthEpisodeText.innerHTML = ("Starships of Episode " + episodeId);

    // switvhing our container
    swithContainer(starshipInfoContainer, mainContainer);

    //sending request and getting name of every starship
    for (let i = 0; i < starshipUrls[episodeId-1].length; i++)
    {
        //handling the request
        let response = await fetch(starshipUrls[episodeId-1][i]);
        let json = await response.json();
        let starshipName = json.name;

        starshipsTitleContainers[i].childNodes[1].innerHTML = starshipName;
        starshipsTitleContainers[i].style.visibility = "visible";

        //attaching starship's URL to it's button. We will use it later...
        starshipsTitleContainers[i].childNodes[3].childNodes[0].setAttribute("starshipURL", starshipUrls[episodeId-1][i]);
    }
}

// a function that navigate us to main container
function backToMoviesButton()
{
    hideElement(starshipInfoContainer);
    hideElement(starshipDetailsContainer);
    hideElement(starshipModelContainer[1]);
    
    for (let i = 0; i < 12; i++)
    {
        hideElement(starshipsTitleContainers[i]);
    }
    
    showElement(mainContainer);
}

//sending request and showing obtained information about starship
async function showDetails(btn)
{
    // activating elements we need
    for (let i = 0; i < 12; i++)
    {
        hideElement(starshipsTitleContainers[i]);
    }

    hideElement(starshipInfoContainer);
    hideElement(mainContainer);
    showElement(starshipDetailsContainer);
    showElement(starshipModelContainer[1]);

    // sending request to get starships informations
    let url = btn.getAttribute("starshipurl");
    let response = await fetch(url);
    let json = await response.json();

    let name = json.name;
    let model = json.model;
    let manufacturer = json.manufacturer;
    let crew = json.crew;
    let passengers = json.passengers;
    let filmsURLs = json.films;

    //setting the big title
    starshipsNameText.innerHTML = name;
    
    // and here we display starship's info
    let text = `<span class="title-text">Model:</span> </br> ${model} </br> </br>
                <span class="title-text">Manufacturer:</span> </br> ${manufacturer} </br> </br>
                <span class="title-text">Crew:</span> </br> ${crew} </br> </br>
                <span class="title-text">Passengers:</span> </br> ${passengers} </br> </br>
                <span class="title-text">Films:</span> </br> </br>`;

     //sending request to get title of movies and adding them to text
    for (let i = 0; i < filmsURLs.length; i++)
    {
        let filmResponse = await fetch(filmsURLs[i]);
        let filmsJson = await filmResponse.json();
        
        text += `${filmsJson.title} </br>`;
    }

    detailsText.innerHTML = text;
}

starshipButtons.forEach(btn => btn.addEventListener('click', function(){
    let episodeId = btn.getAttribute("episodeId");
    setStarshipsList(episodeId);
}));
        
backButton.forEach(btn => btn.addEventListener('click', function(){
    backToMoviesButton() }))

cards.forEach(function(card){
    setTimeout(function(){
        setCardInfo(card)} , 1) });

starshipDetailsButtons.forEach(btn => btn.addEventListener('click', function(){
    showDetails(btn) }))