let deck_obj = [];
var is_grid_view = true;

console.log(deck_obj);

async function addCard(deck) {
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
    deck.push(newCard);
    showDeck(deck);
    updateDeckStats(deck);
};

function removeCard(deck, card_id){
    deck.splice(card_id,1);
    console.log(`Removed card number ${card_id}`)
    console.log(deck);
    showDeck(deck);
    updateDeckStats(deck);
};

function createTextGrid(){
    let card_types = ["Creatures", "Sorceries", "Instants", "Artifacts", "Enchantments", "Lands"];
    const deck_view = document.querySelector(".deck-textview");

    for(i = 0; i < card_types.length; i++) {
        let cell = document.createElement('div');
        cell.id = card_types[i];
        let header = document.createElement("h1");
        header.innerHTML = card_types[i];
        deck_view.appendChild(cell);
        cell.appendChild(header);
    }
}

function getCardType(card) {
    let card_typess = ["Creature", "Sorcery", "Instant", "Artifact", "Enchantment", "Land"];
    let card_type = card['type'];
    for(let i = 0; i < card_typess.length; i++) {
        if(i === 1 && card_type.includes(card_typess[i])){
            return 'Sorcerie'
        }
        else if(card_type.includes(card_typess[i])) {
            card_type = card_typess[i];
            return card_type;
        }
    }
    
}

function showDeck(deck) {

    if(is_grid_view === true) {

        const deckView = document.querySelector(".deck-gridview");
        deckView.replaceChildren();
        for (i = 0; i < deck_obj.length; i++) {
            let card_img = deck[i]['img']
    
            let img = document.createElement('img');
            img.src = card_img;
            img.setAttribute("id", `${i}`)
            img.setAttribute("onclick",`removeCard(deck_obj, this.id);`)
            img.setAttribute("onmouseover", "setPreviewImg(deck_obj, this.id)")
            deckView.appendChild(img);
        }
    }
    else {
        const deckView = document.querySelector(".deck-textview");
        deckView.replaceChildren();

        createTextGrid();

        for (let i = 0; i < deck.length; i++){
            let card_name = document.createElement('p');
            card_name.innerHTML = deck[i]['name'];
            card_name.setAttribute("id", `${i}`)
            card_name.setAttribute("onclick",`removeCard(deck_obj, this.id);`)
            card_name.setAttribute("onmouseover", "setPreviewImg(deck_obj, this.id)")

            let cell = document.querySelector("#" + getCardType(deck[i]) + 's');
            cell.appendChild(card_name);
        }
    }
        
};


function setPreviewImg(deck, card_id) {
    const preview_img = document.querySelector("#preview");
    preview_img.src = deck[card_id]["img"];
}

function updateDeckStats(deck){
    let decksize = deck.length;
    document.querySelector("#decksize").innerHTML = `Deck Size: ${decksize}`;
    
    let totalcmc = 0;
    let lands = 0;
    for(i = 0; i < deck.length; i++){
        let type = String(deck[i]['type']);
        if(type.includes("Land")){
            lands++;
            continue
        }
        else{
            totalcmc = totalcmc + deck[i]['cmc'];
        }
    }
    let averagecmc;
    if (decksize === 0) {
        averagecmc = 0;
    }
    else {
       averagecmc = totalcmc / (decksize - lands);
    }
    document.querySelector("#averagecmc").innerHTML = `Average CMC: ${averagecmc}`
}

const form = document.querySelector("#searchform");
form.addEventListener('submit',  function(e){
    e.preventDefault();
    //add card
    addCard(deck_obj);
    console.log(deck_obj);
})

const grid_view_button = document.querySelector("#gridview");
grid_view_button.addEventListener('click', function(e){
    if(is_grid_view === false) {
        is_grid_view = true;
        const classname = document.querySelector(".deck-textview");
        classname.className = "deck-gridview";
        showDeck(deck_obj);
    }
})

const text_view_button = document.querySelector("#textview");
text_view_button.addEventListener('click', function(e) {
    e.preventDefault();
    if(is_grid_view === true) {
        const classname = document.querySelector(".deck-gridview");
        classname.className = "deck-textview"
        is_grid_view = false;
        showDeck(deck_obj);
    }
})