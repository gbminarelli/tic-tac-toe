import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  const className = props.highlight ? "square highlight" : "square"
  return (
    <button className = {className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  _renderSquare(i) {
    return (
      <Square
        //TODO how to make sure state is updated before sending it back to Square?
        key = {i}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        highlight = {(this.props.winnerSquares && this.props.winnerSquares.includes(i))}
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
        row[j] = this._renderSquare((3 * i) + j);
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
      boldMoveItem: false,
      ascendingOrder: true,
    };
  }

  _handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (_calculateWinner(squares)[0] || squares[i]) {
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
      boldMoveItem: false,
    });
  }

  _jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      boldMoveItem: true,
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
    const [winner, winnerSquares] = _calculateWinner(current.squares);

    const movesAscending = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${this.state.history[move].lastModifiedSquareLocation})` :
        'Go to game start';
      const className = (this.state.stepNumber === move && this.state.boldMoveItem) ?
        'bold' :
        '';
      return (
        <li key={move}>
          <button onClick={() => this._jumpTo(move)} className={className}>{desc}</button>
        </li>
      );
    });

    const moves = this.state.ascendingOrder ? movesAscending : movesAscending.reverse();
    const order = this.state.ascendingOrder ? 'Descending Order' : 'Ascending Order';
    let status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    return (
      <div className = "game">
        <div className = "game-board">
          <Board
            winnerSquares = {winnerSquares}
            squares = {current.squares}
            onClick = {(i) => this._handleClick(i)}
          />
        </div>
        <div className = "game-info">
          <div>{status}</div>
          <button onClick = {() => {
            this.setState({
              ascendingOrder: !this.state.ascendingOrder,
            });
          }}>{order}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const _calculateWinner = (squares) => {
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
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, null];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
