import "./App.css"
import { useReducer } from "react";
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer( state, { type, payload }) {
  // eslint-disable-next-line default-case
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        // eslint-disable-next-line no-undef
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null || 
        state.previousOperand == null)
      {
        return state
      }

      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) {
    return ""
  }

  let computation = ""

  // eslint-disable-next-line default-case
  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
      computation = prev * current;
      break;

    case "÷":
      computation = prev / current;
      break;
  }
  return computation;
}

export default function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return(
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton dispatch={dispatch} digit="1"/>
      <DigitButton dispatch={dispatch} digit="2"/>
      <DigitButton dispatch={dispatch} digit="3"/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton dispatch={dispatch} digit="4"/>
      <DigitButton dispatch={dispatch} digit="5"/>
      <DigitButton dispatch={dispatch} digit="6"/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton dispatch={dispatch} digit="7"/>
      <DigitButton dispatch={dispatch} digit="8"/>
      <DigitButton dispatch={dispatch} digit="9"/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton dispatch={dispatch} digit="0"/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}