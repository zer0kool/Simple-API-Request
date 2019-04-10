// On FORM submit
$("form").on("submit", function (e) {
    event.preventDefault(); //Because who likes page refresheesss
    getData();
});

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

// API call
var getData = function () {
    let user = document.getElementById('search').value;
    let url = `https://api.github.com/users/${user}/repos`;
    console.log('%c' + `Pulling data from user: ${user}`, consoleStylesUser); //loging to console for testting

    //Append data to the div#root
    const app = document.getElementById('root');
    // Building container with user data
    const container = document.createElement('div');
    container.setAttribute('class', `container ${user}`);
    app.appendChild(container);
    $.ajax({
        url: url,
        success: function (data) {
            // Create a request variable and assign a new XMLHttpRequest object to it.
            var request = new XMLHttpRequest();
            // Open a new connection, using the GET request on the URL endpoint
            request.open('GET', url, true);

            request.onload = function () {

                // Begin accessing JSON data here
                var data = JSON.parse(this.response)

                if (request.status >= 200 && request.status < 400) {
                    data.forEach(repo => {
                        // Log each repo title for testing 
                        console.log('...' + repo.name)

                        // Create a div with a card class
                        const card = document.createElement('div');
                        card.setAttribute('class', 'card');

                        // Create an h1 and set the title content
                        const h1 = document.createElement('h1');
                        h1.textContent = repo.name;

                        // Create a p and set the text content
                        const p = document.createElement('p');
                        repo.url = repo.url.substring(0, 300); // Limit to 300 chars
                        p.textContent = `${repo.description}...`; // End with an ellipses

                        // Append the cards to the container element
                        container.appendChild(card);

                        // Each card will contain an h1 and a p
                        card.appendChild(h1);
                        card.appendChild(p);
                    })
                } else {
                    console.log('error');
                }

            }
            request.send();

        }
    });
};
