var sig
function handleCredentialResponse(response) {
    const data = response.credential.split('.');
    var payload = JSON.parse(atob(data[1]));
    const ID = payload.sub
    sig.lastChild.style.display = 'none'
    sig.firstChild.style.display = 'block'
    sig.firstChild.firstChild.src = payload.picture
  }


function createButton() {
    google.accounts.id.initialize({
        client_id: "235879741882-7jnpbc2mhv8nrpdcoch40bk1h8cnvn1p.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt(); // also display the One Tap dialog

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