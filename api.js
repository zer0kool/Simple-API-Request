// This prevents the page from reloading when user request a query On FORM submit
// Because who likes the page to reload when not asked.
$("form").on("submit", function (e) {
    event.preventDefault();
    getData();
    $('.cls').addClass('hide');
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
    var user = document.getElementById('search').value;
    let url = `https://api.github.com/users/${user}/repos`;
    let userUrl = `https://api.github.com/users/${user}`;
    console.log('%c' + `Pulling data from user: ${user}`, consoleStylesUser); // [This can be removed] loging to console for testting

    let publicRecords = 0; // for testing, until new request has been build to the user to the user's endpoint

    // Append data to the div#root
    const app = document.getElementById('root');
    // Building container with user data
    const container = document.createElement('div');
    // changing user class for an ID
    container.setAttribute('id', `${user}`)
    container.setAttribute('class', `container ${user}`);
    container.setAttribute(`style`, `display:flex`)

    // Adding username of user into container
    const username = document.createElement('h2');
    username.setAttribute('class', `${user}`);
    username.textContent = user;


    // Building a block to wrap the repos for better handaling
    let block = document.createElement('div'); // bugged
    block.setAttribute('class', 'repo'); //bugged

    // Adding devider
    const devider = document.createElement('div');
    devider.setAttribute('class', "devider");

    // Building the users header
    const header = document.createElement('div');
    header.setAttribute('class', "userHeader");

    // building an div with and id of info to wrap the avatar and username
    const info = document.createElement('div');
    info.setAttribute('id', "info");

    // Building record elemtn
    let records = document.createElement('h6');
    records.setAttribute('class', "records");
    records.textContent = `${publicRecords} Public records`;


    const avatar = document.createElement('img');

    // The start og the detection rule if user has already made a request
    // by looking at the element class appended by the request script
    var parent = document.querySelector('#root'),
        child = document.querySelector(`.${user}`);

    // If a div inside the #root container holds a class with the username
    if (parent.contains(child)) {
        // ..Then it exists as a child, let the user know.
        var toastHTML = '<span>This user data has already been requested!</span><button class="btn-flat toast-action">Undo</button>';
        M.toast({
            html: toastHTML
        });
    } else {
        M.toast({
            html: `Building a request to the API.`,
            classes: 'rounded'
        })


        // new request for user information
        var inforequest = new XMLHttpRequest();
        inforequest.open('GET', userUrl, true);
        inforequest.onload = function xr() {

            let userInfo = JSON.parse(this.response)
            // Setting avatars placeholder
            avatar.setAttribute('class', 'userAvatar')
            avatar.setAttribute('src', `${userInfo.avatar_url}`);

            // requesting public records
            publicRecords = userInfo.public_repos
            records.textContent = `${publicRecords} Public records`

        }
        inforequest.send();


        // Create a request variable and assign a new XMLHttpRequest object to it.
        var request = new XMLHttpRequest();
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', url, true);
        request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(this.response)

            // catching request.status
            let status = request.status;

            if (status == 403) {
                M.toast({
                    html: `There seems to be an issue with the authentication`,
                    classes: 'round red-text'
                })
            } else {
                // Only display data if connection request was a success
                if (status >= 200 && status < 400) {

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
                            // Using prepend to have the results display before last results.
                            app.prepend(container);
                            container.appendChild(header);
                            header.appendChild(avatar);
                            header.appendChild(info);
                            info.appendChild(username);
                            info.appendChild(records);
                            container.appendChild(block); // .cards will be inside

                            //header.insertAdjacentHTML = '<span class="control"> button </span>';
                            $(`.${user} .userHeader`).append(`
                               <div class="flex"> <span class="${user} settings waves-effect waves-light"> remove </span>
                                  <div id="control" class="switch">
                                    <label>
                                      show
                                      <input class="${user}" type="checkbox" id="box">
                                      <span class="lever"></span>
                                      hidden
                                    </label>
                                  </div></div>
                               `);


                            // For each repo in collection do the following
                            data.forEach(repo => {
                                // Log each repo title for testing               console.log('...' + repo.name)

                                // Create a div with a card class
                                const card = document.createElement('article');
                                card.setAttribute('class', 'card');

                                // construct url for the repository in anchor element
                                const a = document.createElement('a');
                                let repolink = repo.html_url;
                                a.setAttribute('href', `${repolink}`)

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

                                // Append the cards to the blobk element
                                block.appendChild(card);
                                card.setAttribute('scr', `${url}`)
                                card.appendChild(a);
                                // Each card will contain an h1 and a p
                                a.appendChild(h1);
                                a.appendChild(p);


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
                    console.log(`[Error: ${status}] silly rabit! tricks are for kids..`);
                };
                // Appending a devider at the end of all user data.
                container.appendChild(devider);
            }
        }
        // Clearing the search input box.
        document.getElementById('search').value = '';

        // Detecting if an element with class .home exist on page
        if ($('.home').length) {

            // Removing homepage conetent to display the user data
            var home = document.querySelector('.home');
            home.parentNode.removeChild(home);
            // sending the API request
        }
        request.send();

    }
    // Scrolling the page to the element being build.
    //    let myfocus = $(`.${user}`);
    //    console.log(myfocus);
    //    myfocus.scrollIntoView(true);
}
