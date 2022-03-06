import React from "react"

export default function Die(props) {

   const styles = {
      backgroundColor: props.isHeld ? "#fcbf49" : "white"
   }

   return (
      <div
         className="die-face"
         style={styles}
         onClick={props.holdDice}
      >
         <img className="die-img" src={props.image} />
      </div>
   )
}