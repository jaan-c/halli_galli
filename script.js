const Fruit = Object.freeze({
    APPLE: "APPLE",
    BANANA: "BANANA",
    GRAPE: "GRAPE",
    ORANGE: "ORANGE",
    STRAWBERRY: "STRAWBERRY"
});
const FruitUrl = Object.freeze({
    [Fruit.APPLE]: "images/apple.png",
    [Fruit.BANANA]: "images/banana.png",
    [Fruit.GRAPE]: "images/grape.png",
    [Fruit.ORANGE]: "images/orange.png",
    [Fruit.STRAWBERRY]: "images/strawberry.png",
});

class Card {
    static buildDeck() {
        const deck = [];

        for (const fruit of Object.values(Fruit)) {
            for (let i = 1; i <= 5; i++) {
                deck.push(new Card(fruit, i));
            }
        }

        return deck;
    }

    static shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [deck[i], deck[j]] = [deck[j], deck[i]];   // swap
        }
        return deck;
    }

    constructor(fruit, amount) {
        if (!(1 <= amount && amount <= 5)) {
            throw new RangeError("amount must be between 1 to 5");
        }

        this.fruit = fruit;
        this.amount = amount;
    }
}

/// Represents the game state; consists of a deck, the number of 
/// drawn cards, the currently drawn cards which can be lower than the
/// currently drawn cards.
class GameState {
    constructor() {
        const deck = Card.buildDeck();
        Card.shuffleDeck(deck);

        this.deck = deck;
        this.currentDrawIndex = 0;
        this.currentDrawnCards = [undefined, undefined, undefined];
    }

    drawCards() {
        const card = this.deck.pop();

        if (card !== undefined) {
            this.currentDrawnCards[this.currentDrawIndex] = card;
            this.currentDrawIndex = (this.currentDrawIndex + 1) % this.currentDrawnCards.length;
        }
    }
}



let gameState = new GameState();

function onReset() {
    gameState = new GameState();

    updateGameDisplay();
}

function onDrawCards() {
    gameState.drawCards();

    updateGameDisplay();
}


function updateGameDisplay() {
    updateGameStatusDisplay();
    updateAllCardDisplay();
}

function updateGameStatusDisplay() {
    const gameStatusText = document.getElementById("game-status");
    const remainingCardCount = gameState.deck.length;
    const isPlural = remainingCardCount !== 1;

    gameStatusText.textContent = `Remaining Card${isPlural ? 's' : ''}: ${remainingCardCount}`;
}

function updateAllCardDisplay() {
    const currentDrawnCards = gameState.currentDrawnCards;
    const tableDiv = document.getElementById("table");
    const cardDivs = [...tableDiv.children]

    for (const [i, cardDiv] of cardDivs.entries()) {
        const card = currentDrawnCards[i];

        if (card !== undefined) {
            cardDiv.style.display = "flex";
            updateCardDisplay(cardDiv, card);
        } else {
            cardDiv.style.display = "none";
        }
    }

}

function updateCardDisplay(cardDiv, card) {
    const cardFruits = [...cardDiv.children];

    for (const [i, cf] of cardFruits.entries()) {
        if (i < card.amount) {
            cf.src = FruitUrl[card.fruit];
            cf.style.display = "block"
        } else {
            cf.style.display = "none";
        }

    }
}

updateGameDisplay();

