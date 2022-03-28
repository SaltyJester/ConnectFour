let url = window.location.href;

async function createGame(){
    let response = await fetch('create_game', {
        method: 'POST'
    });
    let data = await response.json();
    document.getElementById('link_share').innerHTML = url + 'join/' + data.sessionID;
}