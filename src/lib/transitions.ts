import { Connection, RegularPA, State, Transition } from "../types";
import { addTransition, removeTransition } from "./connections";
import { arrayEqual } from "./simulation";


export const findDuplicateTransition = (transition: Transition, transitions: Transition[]) : Transition[] => {
  let duplicateTransitions = transitions.filter(t => 
    t.id != transition.id &&
    t.cInput === transition.cInput && 
    t.cStateId === transition.cStateId &&
    t.nInputHead === transition.nInputHead &&
    arrayEqual(t.cStack, transition.cStack, t.cStack.length) && 
    arrayEqual(t.nStack, transition.nStack, t.nStack.length))

  return duplicateTransitions
}

export const findInvalidAlphabetUse = (transitions: Transition[]) : boolean => {
  for (let x = 0; x < transitions.length; x++) {
    if (transitions[x].cInput !== transitions[x].nStack[0].slice(-1)) {
        console.log("ERROR: There is atleast one case of the input character not being pushed to the stack properly")
        return true
    }
    for (let y = (x+1); y < transitions.length; y++) {
      if (transitions[x].cInput === transitions[y].cInput &&
        transitions[x].nStack[0].length != transitions[y].nStack[0].length) {
          console.log("ERROR: There is atleast one case of an input character causing two different stack behaviours")
          return true
      }

    }
  }
  return false
}

export const remove = (id: number, transitions: Transition[], states: State[], connections: Connection[]): {states: State[], transitions: Transition[], connections: Connection[]} => {
    let transition = transitions.find(t => t.id === id)
    let cState = -1
    let nState = -1
    if (transition !== undefined) {
        cState = transition.cStateId
        nState = transition.nStateId
        connections = removeTransition(transition, connections)
    }
    transitions = transitions.filter(t => t.id !== id)
  
    return {states: states, transitions: transitions, connections: connections}
}

export const updateInput = (id: number, value: string, transitions: Transition[], deterministic: boolean): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.log("ERROR: That transition cannot be found")
  } else {
    let oldVal = transitions[index].cInput
    transitions[index].cInput = value

    if (deterministic && findDuplicateTransition(transitions[index], transitions).length > 0) {
      transitions[index].cInput = oldVal
    }
  }
  
  return transitions
}

export const updateState = (id: number, name: string, state: boolean, transitions: Transition[], states: State[], connections: Connection[], deterministic: boolean): {states: State[], transitions: Transition[], connections: Connection[]} => {
    
    let tIndex = transitions.findIndex(t => t.id === id)
    if (tIndex === -1) {
      console.log("ERROR: That transition cannot be found")
    } else {
      let sIndex = states.findIndex(s => s.name === name)
      if (sIndex === -1) {
        sIndex = states.length
        states.push({id: states[states.length - 1].id + 1, name: name, initial: false, accepting: false, alternating: false, x: 0, y: 0})
      }

      connections = removeTransition(transitions[tIndex], connections)
      let oldVal = 0
      if (state) {
        oldVal = transitions[tIndex].cStateId
        transitions[tIndex].cStateId = states[sIndex].id
      } else {
        oldVal = transitions[tIndex].nStateId
        transitions[tIndex].nStateId = states[sIndex].id
      }

      if (deterministic && findDuplicateTransition(transitions[tIndex], transitions).length > 0) {
        if (state) {
          transitions[tIndex].cStateId = oldVal
        } else {
          transitions[tIndex].nStateId = oldVal
        }
      }
      connections = addTransition(transitions[tIndex], connections)
    }

    return {states: states, transitions: transitions, connections: connections}
}

export const updateStack = (id: number, value: string | undefined, stack: boolean, stackIndex: number, transitions: Transition[], deterministic: boolean): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.log("ERROR: That transition cannot be found")
  } else {
    let oldVal = ""
    if (stack) {
      oldVal = transitions[index].cStack[stackIndex]
      transitions[index].cStack[stackIndex] = value ?? ""
    } else {
      oldVal = transitions[index].nStack[stackIndex]
      transitions[index].nStack[stackIndex] = value ?? ""
    }

    if (deterministic && findDuplicateTransition(transitions[index], transitions).length > 0) {
      if (stack) {
        transitions[index].cStack[stackIndex] = oldVal
      } else {
        transitions[index].nStack[stackIndex] = oldVal
      }
    }
    console.log(transitions)
    }
    
  return transitions
}

export const updateInputHead = (id: number, value: number, transitions: Transition[], deterministic: boolean): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.log("ERROR: That transition cannot be found")
  } else {
    let oldVal = transitions[index].nInputHead

    transitions[index].nInputHead = value

    if (deterministic && findDuplicateTransition(transitions[index], transitions).length > 0) {
      transitions[index].nInputHead = oldVal
    }
  }
  return transitions
}

export const add = (transitions: Transition[], states: State[], stackCountMax: number, connections: Connection[], cStateId : number=0, cInput : string="0", cStack : string[]=["Z", "Z"], nStateId : number=0, nStack : string[]=["Z", "Z"], nInputHead : number=1): {states: State[], transitions: Transition[], connections: Connection[]} => {
  
  if (states.length === 0) {
    states.push({id: 0, name: 'q0', initial: false, accepting: false, alternating: false, x: 0, y: 0})
  }
  let transitionId = 0
  if (transitions.length !== 0) {
    transitionId = transitions[transitions.length - 1].id + 1
  }
  let nt = {
    id: transitionId,
    cStateId: cStateId,
    cInput: cInput,
    cStack: cStack,
    nStateId: nStateId,
    nStack: nStack,
    nInputHead: nInputHead
  }
  transitions.push(nt)
  connections = addTransition(nt, connections)
  return {states: states, transitions: transitions, connections: connections}
}