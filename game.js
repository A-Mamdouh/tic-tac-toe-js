// A function for easily doing for loops with callbacks
const forEach = (length, callback) => { for (let i=0; i<length; ++i) callback(i) }

class Game {
  constructor() {
    // Precalculate all winning combinations
    this.winningCombs = (() => {
      // Start with diagonal combinations
      let combs = [273, 84]
      // Add rows and columns
      forEach(3, (i) => combs = [...combs, 7 << i * 3, 73 << i])
      return combs
    })()
    // Set new game
    this.newGame()
  }

  newGame() {
    // Clear all cell text
    [...document.getElementsByClassName('cell')]
    .forEach(e => e.textContent = '')
    // Set initial X bit mask
    this.Xs = 0
    // Set initial Y bit mask
    this.Os = 0
    // Set initial turn to X
    this.turnX = true
    // Set game over to false
    this.gameOver = false
    // Set status text
    this.setStatus(`${this.turnX? 'X' : 'O'}'s Turn`)
  }

  setStatus(text) {
    document.getElementById('status').textContent = text
  }

  checkGameOver() {
    // Check if any of the winning combinations match either X's mask or O's mask
    this.gameOver = this.winningCombs.reduce((a, b) =>
    a || (b & this.Xs) === b || (b & this.Os) === b
    ,false)
    // If the game is over
    if(this.gameOver) {
      // Update status text
      this.setStatus(`${this.turnX? 'O' : 'X'} Wins!`)
    }
    // Check for draw
    if((this.Xs | this.Os) === ((1 << 9) - 1)) {
      this.gameOver = true
      this.setStatus('Draw!')
    }
  }

  attachListener (cell, row, col) {
    // Precalculate the bit mask of the cell
    const cellMask = 1 << (row * 3 + col)
    // Define listener
    const listener = () => {
      // If the game is over, create new game
      if(this.gameOver) {
        this.newGame()
      }
      // Check if it's X's turn and the cell is not occupied by O
      if(this.turnX && !(this.Os & cellMask)) {
        // Set the cell bit to 1 in X
        this.Xs |= cellMask
        // Set the cell text to X
        cell.textContent = 'X'
        // Switch turn to O
        this.turnX = false
      } else if ((!this.turnX) && !(this.Xs & cellMask)) { // Check if it's O's turn an the cell is not occupied by X
        // Set the cell bit to 1 in O
        this.Os |= cellMask
        // Set cell text to O
        cell.textContent = 'O'
        // Switch turn to X
        this.turnX = true
      }
      // Set status text
      this.setStatus(`${this.turnX? 'X' : 'O'}'s Turn`)
      // Check if game is over
      this.checkGameOver()
    }
    // Add event listener
    cell.addEventListener('click', listener.bind(this))
  }

  createBoard = () => {
    // get board element
    this.board = document.getElementById('board')
    // Add rows
    forEach(3, (index) => board.appendChild(this.createRow(index)))
  }

  createRow (rowIndex) {
    // Create new element
    const row = document.createElement('div')
    // Set class for styling
    row.setAttribute('class', 'boardRow')
    // Populate row with cells
    forEach(3, (colIndex) => row.appendChild(this.createCell(rowIndex, colIndex)))
    // Return row element
    return row
  }

  createCell(row, col) {
    // Create new element
    const cell = document.createElement('div')
    // Set class for styling
    cell.setAttribute('class', 'cell')
    // Attack click listener to cell
    this.attachListener(cell, row, col)
    // Return cell element
    return cell
  }
}

const game = new Game()

document.onload = game.createBoard()