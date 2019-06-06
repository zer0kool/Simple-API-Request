// On FORM submit
$("form").on("submit", function (e) {
    event.preventDefault(); //Because who likes page refresheesss
    getData();
});

// [This can be removed] Just adding coloring into the console.
var consoleStylesUser = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 1px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 16px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'padding-left: 5px'
    , 'padding-right: 5px'
].join(';');

// The start of the API call
var getData = function () {
    let user = document.getElementById('search').value;
    let url = `https://api.github.com/users/${user}/repos`;
    console.log('%c' + `Pulling data from user: ${user}`, consoleStylesUser); // [This can be removed] loging to console for testting

    // Append data to the div#root
    const app = document.getElementById('root');
    // Building container with user data
    const container = document.createElement('div');
    container.setAttribute('class', `container ${user}`);

    // Adding username of user into container
    const username = document.createElement('h2');
    username.setAttribute('class', `${user}`);
    username.textContent = user;

    // Adding devider
    const devider = document.createElement('div');
    devider.setAttribute('class', "devider");

    // Building the users header
    const header = document.createElement('div');
    header.setAttribute('class', "userHeader");

    // Setting avatars placeholder 
    let image = "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png"
    const avatar = document.createElement('img');
    avatar.setAttribute('src', `${image}`)

    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', url, true);
    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)

        // Only display data if connection request was a success
        if (request.status >= 200 && request.status < 400) {

            // Detecting if json request is empty, if not proceed.
            $.getJSON(url, function (data) {
                if (data.length == 0) {
                    // Letting the user know that this user has no repos to display
                    M.toast({
                        html: `Sorry, but "${user}" doesn't have nothing to display.`,
                        classes: 'rounded yellow darken-4'
                    })
                    console.log("NO DATA!")
                } else {
                    // Appending user elements into container
                    app.appendChild(container);
                    container.appendChild(header);
                    header.appendChild(avatar);
                    header.appendChild(username);

                    // For each repo in collection do the following
                    data.forEach(repo => {
                        // Log each repo title for testing 
                        console.log('...' + repo.name)

                        // Create a div with a card class
                        const card = document.createElement('article');
                        card.setAttribute('class', 'card');

                        // Create an h1 and set the title content
                        const h1 = document.createElement('h1');
                        h1.textContent = repo.name;

                        // Create a p and set the text content
                        const p = document.createElement('p');
                        const url = repo.url;

                        // Replacing the text null with proper description
                        if (`${repo.description}` === "null") {
                            p.textContent = "No description available for this repository";
                        } else {
                            p.textContent = `${repo.description.substring(0, 300)}...`; // Limit to 300 chars && End with an ellipses
                        };

                        // Append the cards to the container element
                        container.appendChild(card);

                        // Each card will contain an h1 and a p
                        card.appendChild(h1);
                        card.appendChild(p);
                        card.setAttribute('src', `${url}`);
                    })
                }
            });
        } else {
            // Letting the user know that nothing was fetch
            M.toast({
                html: `Sorry, but "${user}" doesn't seem to be a user.`,
                classes: 'rounded red darken-4'
            })
            // Logging error on console.
            console.log('[error] silly rabit! tricks are for kids..');
        };
        // Appending a devider at the end of all user data.
        container.appendChild(devider);
    }
    request.send();

}
