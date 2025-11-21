import './App.css'
import { useState, useEffect } from "react";
import clickSound from './assets/key.mp3';

const clickAudio = new Audio(clickSound);


    function App() {
        const [display, setDisplay] = useState("0");
        const [justEvaluated, setJustEvaluated] = useState(false);

        // --- KEYBOARD SUPPORT ---
useEffect(() => {
  const handleKey = (e) => {
    const key = e.key;

    


    //numbers and operators
    if (/^[0-9]$/.test(key) || ["+", "-", "*", "/", "."].includes(key)) {

      handleClick(key);
    }

    // Decimal point
    if (key === ".") {

      handleClick(".");
    }

    // Enter or = → evaluate
    if (key === "Enter" || key === "=") {
      e.preventDefault(); // Prevents form submissions

      calculate();
    }

    // Backspace → delete
    if (key === "Backspace") {
      e.preventDefault();

      del();
    }

    // Escape → clear all
    if (key === "Escape") {

      clear();
    }
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [justEvaluated, display]);


  const playClick = () => {
    clickAudio.currentTime = 0;
    clickAudio.play();
  };


const handleClick = (value) => {
  playClick();

  setDisplay(prev => {
    const operators = ["+", "-", "*", "/"];
    const lastChar = prev.slice(-1);

    // --- Replace display if last action was '=' and a number is pressed
    if (justEvaluated && /[0-9.]/.test(value)) {
      setJustEvaluated(false);
      return value; // start new calculation
    }

    // --- Continue calculation if last action was '=' and operator is pressed
    if (justEvaluated && operators.includes(value)) {
      setJustEvaluated(false);
      return prev + value;
    }

if (operators.includes(value)) {
  if (prev === "0") return value === "-" ? "-" : "0";

  // If last char is an operator
  if (operators.includes(lastChar)) {

    // If pressing "-" after another operator: allow it for negative numbers
    if (value === "-" && lastChar !== "-") {
      return prev + value;
    }

    // If pressing any other operator, replace previous operator(s)
    // Remove consecutive operators at the end, but keep one minus if part of negative
    let newPrev = prev.replace(/[\+\*\/-]+$/, ""); 
    return newPrev + value;
  }
}



    // --- Prevent multiple zeros at start
    if (prev === "0" && value === "0") return "0";

    // --- Replace initial "0" with first number
    if (prev === "0" && !operators.includes(value) && value !== ".") {
      return value;
    }

    // --- Decimal handling
    if (value === ".") {
      const lastNumber = prev.split(/[\+\-\*\/]/).pop(); // get last segment
      if (lastNumber.includes(".")) return prev; // block extra decimal
    }

    return prev + value;
  });
};





        const calculate = () => {
          playClick();
          try {

            const lastChar = display.slice(-1);
            if (["+","-","*","/"].includes(lastChar)) {
              setDisplay("Error");  // prevents eval("5+")
              return;
            }

            const result = eval(display);
            // Round to 5 decimal places if it's not an integer
            const rounded = Number.isInteger(result) ? result : parseFloat(result.toFixed(5));
            setDisplay(String(rounded));
            setJustEvaluated(true);

          } catch {
            setDisplay("Error");
          }
        };

        const clear = () => {
          playClick();

          setDisplay("0");
        };

        const del = () => {
          playClick();

          setDisplay(prev => {
            const newString = prev.slice(0, -1);
            return newString === "" ? "0" : newString; //So the display is never empty
      });
        };


        const symbol = <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#000000"><path d="m456-320 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm400 0Z"/></svg>;

      return (
        <div id="calculator">
          <div id="display">{display}</div>
          <div id="buttons">

        <button className="button" id="delete" onClick={del}>{symbol}</button>
        <button className="button" id="clear" onClick={clear}>AC</button>

        <button className="button operator" id="divide" onClick={() => handleClick("/")}>/</button>
        <button className="button operator" id="multiply" onClick={() => handleClick("*")}>X</button>

        <button className="button number" id="seven" onClick={() => handleClick("7")}>7</button>
        <button className="button number" id="eight" onClick={() => handleClick("8")}>8</button>
        <button className="button number" id="nine" onClick={() => handleClick("9")}>9</button>
        <button className="button operator" id="subtract" onClick={() => handleClick("-")}>-</button>

        <button className="button number" id="four" onClick={() => handleClick("4")}>4</button>
        <button className="button number" id="five" onClick={() => handleClick("5")}>5</button>
        <button className="button number" id="six" onClick={() => handleClick("6")}>6</button>
        <button className="button operator" id="add" onClick={() => handleClick("+")}>+</button>

        <button className="button number" id="one" onClick={() => handleClick("1")}>1</button>
        <button className="button number" id="two" onClick={() => handleClick("2")}>2</button>
        <button className="button number" id="three" onClick={() => handleClick("3")}>3</button>

        <button className="button number" id="zero" onClick={() => handleClick("0")}>0</button>
        <button className="button" id="decimal" onClick={() => handleClick(".")}>.</button>

        <button className="button" id="equals" onClick={calculate}>=</button>


          </div>
        </div>
      );
    }

    export default App;