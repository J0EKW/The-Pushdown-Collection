import { Connection, RegularPA, State, Transition } from "../types";
import { addTransition, removeTransition } from "./connections";
import { arrayEqual } from "./simulation";

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

export const updateInput = (id: number, value: string, transitions: Transition[]): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  transitions[index].cInput = value

  return transitions
}

export const updateState = (id: number, name: string, state: boolean, deterministic: boolean, transitions: Transition[], states: State[], connections: Connection[]): {states: State[], transitions: Transition[], connections: Connection[]} => {
    
    let tIndex = transitions.findIndex(t => t.id === id)
    if (tIndex === undefined) {
      console.log("ERROR: That transition cannot be found")
    } else {
      let sIndex = states.findIndex(s => s.name === name)
      if (sIndex === -1) {
        sIndex = states.length
        states.push({id: states[states.length - 1].id + 1, name: name, initial: false, accepting: false, alternating: false, x: 0, y: 0})
      } else if (state && deterministic) {
        let duplicates = transitions.filter(t => 
          t.cInput === transitions[tIndex].cInput &&
          arrayEqual(t.cStack, transitions[tIndex].cStack, t.cStack.length) &&
          t.cStateId === states[sIndex].id)

          if (duplicates.length > 0) {
            console.log("ERROR: You are trying to make a transition that already exists whilst enforcing determinism")
            return {states: states, transitions: transitions, connections: connections}
          }
      }

      connections = removeTransition(transitions[tIndex], connections)
      if (state) {
        transitions[tIndex].cStateId = states[sIndex].id
      } else {
        transitions[tIndex].nStateId = states[sIndex].id
      }
      connections = addTransition(transitions[tIndex], connections)
    }

    return {states: states, transitions: transitions, connections: connections}
}

export const updateStack = (id: number, value: string | undefined, stack: boolean, stackIndex: number, transitions: Transition[]): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  if (index !== -1) {
    if (stack) {
      let duplicates = transitions.filter(t => 
        t.cInput === transitions[index].cInput &&
        arrayEqual(t.cStack, transitions[index].cStack, t.cStack.length) &&
        t.cStateId === states[index].id)

        if (duplicates.length > 0) {
          console.log("ERROR: You are trying to make a transition that already exists whilst enforcing determinism")
          return {states: states, transitions: transitions, connections: connections}
        }
      transitions[index].cStack[stackIndex] = value ?? ""
    } else {
      transitions[index].nStack[stackIndex] = value ?? ""
    }
  }
  return transitions
}

export const updateInputHead = (id: number, value: number, transitions: Transition[]): Transition[] => {
  let index = transitions.findIndex(t => t.id === id)
  if (index !== -1) {
    transitions[index].nInputHead = value
  }
  return transitions
}

export const add = (transitions: Transition[], states: State[], stackCountMax: number, connections: Connection[]): {states: State[], transitions: Transition[], connections: Connection[]} => {
  
  if (states.length === 0) {
    states.push({id: 0, name: 'q0', initial: false, accepting: false, alternating: false, x: 0, y: 0})
  }
  let transitionId = 0
  if (transitions.length !== 0) {
    transitionId = transitions[transitions.length - 1].id + 1
  }

  transitions.push({id: transitionId, cStateId: 0, cInput: '0', cStack: Array(stackCountMax).fill('Z'), nStateId: 0, nStack: Array(stackCountMax).fill('Z'), nInputHead: 1})
  connections = addTransition(transitions[transitions.length - 1], connections)
  return {states: states, transitions: transitions, connections: connections}
}