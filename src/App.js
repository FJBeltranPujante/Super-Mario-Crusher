import { useEffect, useState } from "react";
import ScoreBoard from "./components/scoreboard";
import luigi from "./images/luigi.gif";
import happy_cloud from "./images/happy_cloud.gif";
import block from "./images/block.gif";
import mario from "./images/mario.gif";
import goomba from "./images/goomba.gif";
import toad from "./images/toad.gif";
import blank from "./images/blank.png";

const width = 8;
const characters = [luigi, block, mario, goomba, toad, happy_cloud];

const App = () => {
  const [currentCharacterArrangement, setCurrentCharacterArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColumnOfFour = () => {
      for (let i = 0; i <= 39; i++) {
          const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
          const decidedCharacter = currentCharacterArrangement[i]
          const isBlank = currentCharacterArrangement[i] === blank

          if (columnOfFour.every(square => currentCharacterArrangement[square] === decidedCharacter && !isBlank)) {
              setScoreDisplay((score) => score + 4)
              columnOfFour.forEach(square => currentCharacterArrangement[square] = blank)
              return true
          }
      }
  }

  const checkForRowOfFour = () => {
      for (let i = 0; i < 64; i++) {
          const rowOfFour = [i, i + 1, i + 2, i + 3]
          const decidedCharacter = currentCharacterArrangement[i]
          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
          const isBlank = currentCharacterArrangement[i] === blank

          if (notValid.includes(i)) continue

          if (rowOfFour.every(square => currentCharacterArrangement[square] === decidedCharacter && !isBlank)) {
              setScoreDisplay((score) => score + 4)
              rowOfFour.forEach(square => currentCharacterArrangement[square] = blank)
              return true
          }
      }
  }

  const checkForColumnOfThree = () => {
      for (let i = 0; i <= 47; i++) {
          const columnOfThree = [i, i + width, i + width * 2]
          const decidedCharacter = currentCharacterArrangement[i]
          const isBlank = currentCharacterArrangement[i] === blank

          if (columnOfThree.every(square => currentCharacterArrangement[square] === decidedCharacter && !isBlank)) {
              setScoreDisplay((score) => score + 3)
              columnOfThree.forEach(square => currentCharacterArrangement[square] = blank)
              return true
          }
      }
  }

  const checkForRowOfThree = () => {
      for (let i = 0; i < 64; i++) {
          const rowOfThree = [i, i + 1, i + 2]
          const decidedCharacter = currentCharacterArrangement[i]
          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
          const isBlank = currentCharacterArrangement[i] === blank

          if (notValid.includes(i)) continue

          if (rowOfThree.every(square => currentCharacterArrangement[square] === decidedCharacter && !isBlank)) {
              setScoreDisplay((score) => score + 3)
              rowOfThree.forEach(square => currentCharacterArrangement[square] = blank)
              return true
          }
      }
  }

  const moveIntoSquareBelow = () => {
      for (let i = 0; i <= 55; i++) {
          const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
          const isFirstRow = firstRow.includes(i)

          if (isFirstRow && currentCharacterArrangement[i] === blank) {
              let randomNumber = Math.floor(Math.random() * characters.length)
              currentCharacterArrangement[i] = characters[randomNumber]
          }

          if ((currentCharacterArrangement[i + width]) === blank) {
              currentCharacterArrangement[i + width] = currentCharacterArrangement[i]
              currentCharacterArrangement[i] = blank
          }
      }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };
  const dragEnd = (e) => {
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );

    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    const validMoves = [
      squareBeingDraggedId - 1,

      squareBeingDraggedId - width,

      squareBeingDraggedId + 1,

      squareBeingDraggedId + width,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);
    if (validMove) {
      currentCharacterArrangement[squareBeingReplacedId] =
        squareBeingDragged.getAttribute("src");

      currentCharacterArrangement[squareBeingDraggedId] =
        squareBeingReplaced.getAttribute("src");

      const isAColumnOfFour = checkForColumnOfFour();

      const isARowOfFour = checkForRowOfFour();

      const isAColumnOfThree = checkForColumnOfThree();

      const isARowOfThree = checkForRowOfThree();

      if (
        squareBeingReplacedId &&
        (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)
      ) {
        setSquareBeingDragged(null);

        setSquareBeingDragged(null);
      } else {
        currentCharacterArrangement[squareBeingReplacedId] =
          squareBeingReplaced.getAttribute("src");

        currentCharacterArrangement[squareBeingDraggedId] =
          squareBeingDragged.getAttribute("src");

        setCurrentCharacterArrangement([...currentCharacterArrangement]);
      }
    }
  };

  const createBoard = () => {
    setCurrentCharacterArrangement(
      [...Array(width * width)].map(
        (_) => characters[Math.floor(Math.random() * characters.length)]
      )
    );
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentCharacterArrangement([...currentCharacterArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentCharacterArrangement,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentCharacterArrangement.map((characters, index) => (
          <img
            key={index}
            src={characters}
            alt={characters}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
