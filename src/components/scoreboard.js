const ScoreBoard = ({ score }) => {
    return (
      <div className="score-board">
        <h1>Score</h1>
        <h2><img src={ require('./coin.gif') } /> x{score}</h2>
      </div>
    )
  }
  
  export default ScoreBoard