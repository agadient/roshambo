const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv


class ArgParser {
    constructor(argv) {
        this._move = argv.move
    }

    check_args() {
        if (!this._move) {
            return false
        }
        return true
    }

    get move() {
        return this._move
    }   
}



class Logger {
    constructor(logLevel=1) {
        this._logLevel = logLevel
        this._levels = {error: 0, game: 1, info: 2}
    }

    get logLevel() {
        return this._logLevel
    }

    set logLevel(logLevel) {
        this._logLevel = logLevel
    }

    debug(msg) {
        if (2 <= this._logLevel) {
            console.log("DEBUG: " + `${msg}`)
        }
    }

    game(msg) {
        if (1 <= this._logLevel) {
            console.log(`${msg}`)
        }
    }

    error(msg) {
        if (0 <= this._logLevel) {
            console.log("ERROR: " + `${msg}`)
        }
    }

}



class Game {
    constructor(argv) {
        this._parser = new ArgParser(argv)
        this._logger = new Logger(1)
        this._validMoves = ["rock", "paper", "scissors"]
        this._computerMove = this._validMoves[Math.floor(Math.random() * this._validMoves.length)];
        this._tie = 0
        this._computerWin = 1
        this._playerWin = 2
        // 0 is tie, 1 is computer win, 2 is payer win
        // format is playerMoveComputerMove : outcome
        this._gameOutcomes = {
            paperpaper : this._tie,
            paperscissors : this._computerWin,
            paperrock : this._playerWin,
            scissorspaper : this._playerWin,
            scissorsscissors : this._tie,
            scissorsrock : this._computerWin,
            rockpaper : this._computerWin,
            rockscissors : this._playerWin,
            rockrock : this._tie
        }
    }

    playGame() {
        if (!this._parser.check_args()) {
            this._logger.error("USAGE: roshambo.js --move={rock,paper,scissors}")
            return
        }
        this._playerMove = this._validMoves.filter(valid_move => valid_move === this._parser.move)
        if (this._playerMove.length === 0) {
            this._logger.error("VALID MOVES: rock,paper,scissors")
            return
        }
        this._playerMove = this._playerMove[0]

        this.welcomeMessage()
        this.playerMove()
        this.computerMove()
        this.evalGame()
    }

    welcomeMessage() {
        this._logger.game("Playing a game of Roshambo against the computer.")
    }

    playerMove() {
       this._logger.game(`Player plays ${this._playerMove}!`)
    }

    computerMove() {
        this._logger.game(`Computer plays ${this._computerMove}!`)
    }

    evalGame() {
        if (this._gameOutcomes[this._playerMove+this._computerMove] === 0) {
            this.tie()
        } else if (this._gameOutcomes[this._playerMove+this._computerMove] === 1) {
            this.computerWin()
        } else if (this._gameOutcomes[this._playerMove+this._computerMove] === 2) {
            this.playerWin()
        }
    }

    tie() {
        this._logger.game("~Tie.~")
    }

    computerWin() {
        this._logger.game("~Computer wins.~")
    }

    playerWin() {
        this._logger.game("~Player wins.~")
    }

}

game = new Game(argv)
game.playGame()
