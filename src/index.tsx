import React from 'react';
import ReactDOM from 'react-dom';
import { Repeat } from 'typescript-tuple'
import { useState } from 'react';
import './index.css';

type SquareState = '0' | 'X' | null

type SquareProps = {
    value: SquareState
    onClick: () => void
}

const Square = (props: SquareProps) => (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
)
  
type BoardState = Repeat<SquareState, 9>

type BoardProps = {
    squares: BoardState
    onClick: (i:number) => void
}

const Board = (props: BoardProps) => {
    const renderSquare = (i: number) => (
        <Square value={props.squares[i]} onClick={() => props.onClick(i)} />
    )
    return (
        <div>
            <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
            </div>
            <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
            </div>
            <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
            </div>
        </div>
    )
}
  
type Step = {
    squares: BoardState
    xIsNext: boolean
}

type GameState = {
    readonly history: Step[]
    readonly stepNumber: number
}


const Game = () => {
    const [state, setState] = useState<GameState>({
        history: [{
            squares: [null, null, null, null, null, null, null, null, null],
            xIsNext: true,
        }],
        stepNumber: 0
    })
    const current = state.history[state.stepNumber]
    const winner = calculateWinner(current.squares)
    let status
    if (winner) {
        status = '勝者: ' + winner
    } else {
        status = '次の手番: ' + (current.xIsNext ? 'X' : '0')
    }
    const handleClick = (i: number) => {
        if (winner || current.squares[i]) {
            return
        }
        const next: Step = (({ squares, xIsNext }) => {
            const nextSquares = squares.slice() as BoardState
            nextSquares[i] = xIsNext ? 'X' : '0'
            return {
                squares: nextSquares,
                xIsNext: !xIsNext,
            }
        })(current)
        setState(({ history, stepNumber }) => {
            const newHistory = history.slice(0, stepNumber + 1).concat(next)
            return {
                history: newHistory,
                stepNumber: newHistory.length - 1
            }
        })
    }
    const jumpTo = (step: number) => {
        setState(prev => ({
            ...prev,
            stepNumber: step,
        }))
    }

    const moves = state.history.map((step, move) => {
        const desc = move > 0 ? `No.${move}に戻る` : '初めに戻る'
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={handleClick}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
        </div>
    );
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  


function calculateWinner(squares: BoardState) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }