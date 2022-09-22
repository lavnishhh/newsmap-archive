var sig

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sleep = ms => new Promise(r => setTimeout(r, ms));
function handleCredentialResponse(response) {
    const data = response.credential.split('.');
    var payload = JSON.parse(atob(data[1]));
    const ID = payload.sub
    sig.lastChild.style.display = 'none'
    sig.firstChild.style.display = 'block'
    sig.firstChild.firstChild.src = payload.picture
  }


async function createSignIn() {
    google.accounts.id.initialize({
        client_id: "235879741882-7jnpbc2mhv8nrpdcoch40bk1h8cnvn1p.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt(); // also display the One Tap dialog

    await sleep(1);
    sig = document.getElementsByClassName('g_id_signin')[0].firstChild
    sig.firstChild.style.display = 'none'
    sig.firstChild.innerHTML = '<img class="profile-image" id="profile-image" src="{image-url}" onclick="signOut()">'.replace("{image-url}","https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg")

}

function signOut(){
    signOutBox.style.display = 'flex'
    const s = signOutButton.addEventListener('click',() => {
        sig.lastChild.style.display = 'block'
        sig.firstChild.style.display = 'none'
        google.accounts.id.disableAutoSelect()
        signOutBox.style.display = 'none'
    })
    cancelButton.addEventListener('click',() => {
        signOutButton.removeEventListener('click',s)
        cancelButton.removeEventListener('click', this)
        signOutBox.style.display = 'none'
    })
}

document.getElementById('loc-search').addEventListener('focusin',() => {
    document.getElementById('loc-search-menu').style.display = 'block';
    document.getElementById('loc-search-menu').style.opacity = 1;
    document.addEventListener('keydown',(key) => {
        
    })
});

document.getElementById('loc-search').addEventListener('focusout', () => {
    document.getElementById('loc-search-menu').style.opacity = 0;
    delay(200).then(() => {
        document.getElementById('loc-search-menu').style.display = 'none';
    })
});


document.getElementById('source-search').addEventListener('focusin',() => {
    document.getElementById('source-search-menu').style.display = 'block';
    document.getElementById('source-search-menu').style.opacity = 1;
});

document.getElementById('source-search').addEventListener('focusout', () => {
    document.getElementById('source-search-menu').style.opacity = 0;
    delay(200).then(() => {
        document.getElementById('source-search-menu').style.display = 'none';
    })
});

//query = '?source=' + source + '&loc='  + place.toLowerCase()
// var newurl = window.location.origin + window.location.pathname + query;
//           window.history.pushState({path:newurl},'',newurl);