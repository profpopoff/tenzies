import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {
      setRolls(prevRolls => prevRolls + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    } else {
      setRolls(0)
      setTenzies(false)
      setDice(allNewDice())
      localStorage.getItem("bestScore") ? 
      rolls < localStorage.getItem("bestScore") && localStorage.setItem("bestScore", rolls) : 
      localStorage.setItem("bestScore", rolls)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  function importAll(r) {
    let images = {}
    r.keys().forEach(item => {images[item.replace('./', '')] = r(item)})
    return images
  }

  const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/))

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
      image={images[`dice_icon_${die.value}.svg`]}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti width={window.innerWidth} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to&nbsp;freeze it&nbsp;at&nbsp;its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>

      <button
        className="roll-dice"
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
      <h2 className="rolls-count">Rolls: {rolls}</h2>
      {localStorage.getItem("bestScore") && <h2 className="rolls-count">Best score: {localStorage.getItem("bestScore")}</h2>}
    </main>
  )
}