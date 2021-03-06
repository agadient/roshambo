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
    static logLevels = {error: 0, game: 1, debug: 2}
    constructor(logLevel=1) {
        this._logLevel = logLevel
    }

    get logLevel() {
        return this._logLevel
    }

    set logLevel(logLevel) {
        this._logLevel = logLevel
    }

    debug(msg) {
        if (Logger.logLevels.debug <= this._logLevel) {
            console.log("DEBUG: " + `${msg}`)
        }
    }

    game(msg) {
        if (Logger.logLevels.game <= this._logLevel) {
            console.log(`${msg}`)
        }
    }

    error(msg) {
        if (Logger.logLevels.error <= this._logLevel) {
            console.log("ERROR: " + `${msg}`)
        }
    }

}

class Game {
    static validMoves = ["rock", "paper", "scissors"]
    static tie = 0
    static computerWin = 1
    static playerWin = 2
    // 0 is tie, 1 is computer win, 2 is payer win
    // format is playerMoveComputerMove : outcome
    static gameOutcomes = {
        paperpaper : Game.tie,
        paperscissors : Game.computerWin,
        paperrock : Game.playerWin,
        scissorspaper : Game.playerWin,
        scissorsscissors : Game.tie,
        scissorsrock : Game.computerWin,
        rockpaper : Game.computerWin,
        rockscissors : Game.playerWin,
        rockrock : Game.tie
    }
    constructor(argv) {
        this._parser = new ArgParser(argv)
        this._logger = new Logger(Logger.logLevels.game)
        this._computerMove = Game.validMoves[Math.floor(Math.random() * Game.validMoves.length)];

    }

    playGame() {
        if (!this._parser.check_args()) {
            this._logger.error("USAGE: roshambo.js --move={rock,paper,scissors}")
            return
        }
        this._playerMove = Game.validMoves.filter(valid_move => valid_move === this._parser.move)
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
        if (Game.gameOutcomes[this._playerMove+this._computerMove] === Game.tie) {
            this.tie()
        } else if (Game.gameOutcomes[this._playerMove+this._computerMove] === Game.computerWin) {
            this.computerWin()
        } else if (Game.gameOutcomes[this._playerMove+this._computerMove] === Game.playerWin) {
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
