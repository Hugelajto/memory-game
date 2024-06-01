const images = [ "1F92B.svg", "1F92D.svg", "1F92E.svg", "1F602.svg", "1F605.svg", "1F606.svg", "1F607.svg", "1F609.svg", "1F618.svg", "1F643.svg", "1F929.svg", "1F970.svg",]
const cardContainer = document.querySelector(".card-container")
const restartBtn = document.querySelector(".restart-btn")
const playerInputOne = document.querySelector(".player-one")
const playerInputTwo = document.querySelector(".player-two")
const updateNameBtn = document.querySelector(".update-name-btn")
const winnerContainer = document.querySelector(".winner-container")
const winnerName = document.querySelector(".winner-name")
const winnerTimer = document.querySelector(".winner-timer")

let playerOne = {
  name: 'Player One',
  score: 0,
}

let playerTwo = {
  name: 'Player Two',
  score: 0,
}


let gameTurn = 0
const players = [ playerOne, playerTwo ]
let matchedCards = []
let cards = [...images, ...images]
let selectedCards = []



const createNewArticle = (container, backImg,) => {
  let newArticleContent = `
  <div class = "card"  onclick="clickCard(event)">
  <div class = "front">
  </div>
  <img class="back rotate" src="./assets/${backImg}"  alt="${backImg}" width=110px>
  </div>
  `

  let newArticle = document.createElement("div")
  newArticle.className = "cardContainer"
  newArticle.innerHTML = newArticleContent

  container.append(newArticle)
}

const createScoreBoard = () => {
  let newScoreBoardContent = `
  <h2 class=${players[gameTurn] === playerOne ? 'selected-player' : ''}>${playerOne.name} <p>score: ${playerOne.score}</p></h2>
  <h2 class=${players[gameTurn] === playerTwo ? 'selected-player' : ''}>${playerTwo.name} <p>score: ${playerTwo.score}</p></h2>
  `
  let newScoreBoard = document.createElement("div")
  newScoreBoard.className = "playerScore"
  newScoreBoard.innerHTML = newScoreBoardContent

  let scoreBoard = document.querySelector(".score-board")

  scoreBoard.append(newScoreBoard)
}

createScoreBoard()

const updateScore = () => {
  document.querySelector('.playerScore').remove()
  createScoreBoard()
}

updateNameBtn.addEventListener('click', () => {
  if(playerInputOne.value === '' || playerInputTwo.value === '') return false

  playerOne.name = playerInputOne.value

  playerTwo.name = playerInputTwo.value

  updateScore()

  playerInputOne.classList.add('none')

  playerInputTwo.classList.add('none')

  updateNameBtn.classList.add('none')
})


const checkWinner = () => {
  if(matchedCards.length === cards.length){
    setTimeout(()=>{
      winnerContainer.style.display = 'flex'
      if(playerOne.score > playerTwo.score){
        winnerName.innerText = `Congratulations! + ${playerOne.name}`
      } else if (playerOne.score < playerTwo.score) {
        winnerName.innerText = `Congratulations! + ${playerTwo.name}`
      } else {
        winnerName.innerText = `It's a tie!`
      }
      let count = 6
      const timer = setInterval(()=> {
        count--
        winnerTimer.innerText = `The game will restart in: ${count}`;

        if(count === 0) {
          clearInterval(timer)
          location.reload()
        } 
      },1000)
    },500)
  } else {
  }
}


const getFrontAndBackFromCard = (card) => {
  const front = card.querySelector(".front")
  const back = card.querySelector(".back")
  return [front, back]
}

const shuffle = () => {  
  cards.sort(() =>Math.random() - 0.5);  
  return cards;  
}  

const renderCards = () => {
  for(let i = 0; i < cards.length; i++) {    
    createNewArticle(cardContainer, cards[i])
  }
}

renderCards(shuffle())


const clickCard = (event) => {
  const memoryCard = event.currentTarget
  const [front, back] = getFrontAndBackFromCard(memoryCard)

  if(selectedCards.includes(back)) return false
  
  if(selectedCards.length == 2) return false

    front.classList.toggle("rotate")
    back.classList.toggle("rotate")
    gameLogic(memoryCard)
}

const gameLogic = (memoryCard) => {
  selectedCards.push(memoryCard.querySelector(".back"))
  if(selectedCards.length === 2) {
    const [firstCard, secondCard] = selectedCards
    if(firstCard.src === secondCard?.src) { 
      players[gameTurn].score ++

      updateScore()

      firstCard.parentElement.style.opacity = 0.5
      secondCard.parentElement.style.opacity = 0.5

      firstCard.parentElement.removeAttribute("onclick")
      secondCard.parentElement.removeAttribute("onclick")
      
      matchedCards.push(firstCard,secondCard)
      selectedCards = [] 
      checkWinner()
    } else{ 
      setTimeout(()=>{ 
        const [firstCardFront, firstCardBack] = getFrontAndBackFromCard(firstCard.parentElement)
        const [secondCardFront, secondCardBack] = getFrontAndBackFromCard(secondCard.parentElement)
        firstCardFront.classList.toggle("rotate")
        firstCardBack.classList.toggle("rotate")
        secondCardFront.classList.toggle("rotate")
        secondCardBack.classList.toggle("rotate")
        selectedCards = [] 
        gameTurn = (gameTurn + 1) % 2

        updateScore()
      },1000)
    }
}
  
}



restartBtn.addEventListener('click', ()=> {
  playerOne.score = 0
  playerTwo.score = 0
  gameTurn = 0
  const cards = document.querySelectorAll(".cardContainer")
  cards.forEach(card => card.remove())
  renderCards(shuffle())
  updateScore()
})

