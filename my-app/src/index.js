import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { //TODO better way with ES6
  return (
    <button className = "square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) { //TODO use the convention name for custom methods
    return (
      <Square
        //TODO how to make sure state is updated before sending it back to Square?
        key = {i}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }

  _renderRow(row) {
    return (
      <div
        key = {row[0].key}
        className = "board-row"
      >
        {row}
      </div>
    );
  }

  _renderBoard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row[j] = this.renderSquare((3 * i) + j);
      }
      board[i] = this._renderRow(row);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this._renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastModifiedSquareLocation: [null, null],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) { //TODO use the convention name for custom methods
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]; //TODO better way with ES6
    const squares = current.squares.slice(); //TODO better way with ES6
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastModifiedSquareLocation: this._squareLocation(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  _boldTargetItem(target) {
    for (const child of target.parentElement.parentElement.children) {
      child.firstElementChild.classList.remove('bold');
    }
    target.className = 'bold';
  }

  jumpTo(step, event) { //TODO use the convention name for custom methods
    this._boldTargetItem(event.target);
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  _squareLocation(index) {
    //This method simply converts the index of a square in the squares array into its location on the Board
    //using the [col, row] coordinates format
    let [col, row] = [null, null];
    //Checking row
    if (index < 3) {
      row = 1;
    } else if (index < 6) {
      row = 2;
    } else {
      row = 3;
    }
    //Checking col
    if ((index % 3) === 0) {
      col = 1;
    } else if (((index - 1) % 3) === 0) {
      col = 2;
    } else {
      col =3;
    }
    return [col, row];
  }

  render() {
    //TODO how to make sure state is updated before rerendering?
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${this.state.history[move].lastModifiedSquareLocation})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={(event) => this.jumpTo(move, event)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) { //TODO better way with ES6 and change it to _calculateWinner
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) { //TODO better way with ES6
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
