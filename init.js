// Start of mutations
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

// Select the node that will be observed for mutations
const target = document.querySelector(`#root`)

// Options for the observer (which mutations to observe)
const config = {
    attributes: false,
    childList: true, // just observing all elements inside of #root
    subtree: false
};

let mutationRecord = []; // Mutation array for observer nodes
const observer = new MutationObserver(function (mutations) { // main obeserver

    mutations.forEach(function (mutation) { // detecting all mutations iside #root
        if ($('.container').length) {
            var containerID = $(".container").attr('id'); // collecting the id for the container
            if (containerID === undefined) { // preventing undefined errors
                console.log(`Mutation observer is empty`);
            } else { // if a .container exist and not undefined
                console.log(`Mutation set for #${containerID}`); // report back to console
                mutationRecord.push(containerID); // add oberser to mutation record
            }
        }

        console.log(`mutations =`, mutationRecord); // displays the mutation record to console
        record = containerID; // I have no idea why this worked and not containerID, but whatever :)
        $('#box').on('change', function (record) { // tracking the user change for hide/show toggle
            let status = $(this).prop('checked'); // returns true or false
            console.log(`status is ${status} for ${containerID}`) //Not really needed, but usefull for debuggin

            if (status === true) { // true is equal to hide
                $(`.${containerID} .repo`).addClass('hide');
            } else { // if not equal display content
                $(`.${containerID} .repo`).removeClass('hide');
            }
        }); // end of box.on change

        //logic for when user clicks on the remove button
        $('.settings').on('click', function () {
            let userDATA = $(this).attr('class').split(' ', 1)[0]; // collecting the first shared class from the element
            if ($(`#${userDATA}`).length) {
                // removing the observer from the mutation array
                mutationRecord.splice(userDATA); // remove data from mutationrecord
                $(`#${userDATA}`).remove(); // remove data from html
                M.toast({ // report to user data was removed
                    html: `removing ${userDATA} data`,
                    classes: 'rounded grey darken-4'
                })
            }
        }); // end of logic for the remove button.

    }); // end of foreach mutation
}); // end of observer

// Start observing the target node for configured mutations
observer.observe(target, config);
