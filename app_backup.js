var deck_obj = [];

const form = document.querySelector("#searchform");
form.addEventListener('submit', async function(e){
    e.preventDefault();
    
    //create a card object and add to deck array
    createCard(deck_obj);
    console.log(deck_obj);
    //update webpage with card images
    addCard();
})

async function addCard(){
    const searchterm = form.elements.query.value;
    let query = searchterm.replace(/ /g, "+");
    //console.log(query);

    let card = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${query}`);
    let card_img = card['data']['image_uris'].small;
    //console.log(card_img);

    const deck = document.querySelector(".deck");
    let img = document.createElement('img');
    img.src = card_img;
    deck.appendChild(img);
}

async function createCard(deck) {
    const searchterm = form.elements.query.value;
    let query = searchterm.replace(/ /g, "+");
    let card = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${query}`);

    const newCard= {
        name: card['data']['name'],
        color: card['data']['colors'],
        cmc: card['data']['cmc'],
        type: card['data']['type_line'],
        img: card['data']['image_uris'].small
    };
    //console.log(newCard['cmc'])
    deck.push(newCard);
    updateStats(deck);
}

function updateStats(deck){
    let decksize = deck.length;
    document.querySelector("#decksize").innerHTML = `Deck Size: ${decksize}`;
    
    let totalcmc = 0;
    let lands = 0;
    for(i = 0; i < deck.length; i++){
        let type = String(deck[i]['type']);
        console.log(type);
        if(type.includes("Land")){
            lands++;
            continue
        }
        else{
            totalcmc = totalcmc + deck[i]['cmc'];
        }
    }
    let averagecmc = totalcmc / (decksize - lands);
    document.querySelector("#averagecmc").innerHTML = `Average CMC: ${averagecmc}`
}