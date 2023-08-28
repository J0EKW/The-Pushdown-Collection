import { Connection, RegularPA, State, Transition } from "../types"

export const remove = (id: number, transitions: Transition[], states: State[], connections: Connection[]): {states: State[], transitions: Transition[], connections: Connection[]} => {
    states = states.filter(s => s.id !== id)
    transitions = transitions.filter(t => t.cStateId !== id && t.nStateId !== id)
    connections = connections.filter(c => c.cStateId !== id && c.nStateId !== id)
    return {states: states, transitions: transitions, connections: connections}
}

export const updateName = (id: number, name: string, states: State[]): State[] => {
    let state = states.findIndex(s => s.id === id)
    if (state !== -1) {
        states[state].name = name
    }
    return states
}

export const updateInit = (id: number, value: boolean, states: State[]): State[] => {
    let oldInit = states.findIndex(s => s.initial)
    if (value && oldInit !== -1) {
        states[oldInit].initial = false
    }
    let state = states.findIndex(s => s.id === id)
    if (state !== -1) {
        states[state].initial = value
    }
    return states
}

export const updateAccepting = (id: number, value: boolean, states: State[]): State[] => {

    let state = states.findIndex(s => s.id === id)
    if (state !== -1) {
        states[state].accepting = value
    }
    return states
}

export const updateAlternating = (id: number, value: boolean, states: State[]): State[] => {

    let state = states.findIndex(s => s.id === id)
    if (state !== -1) {
        states[state].alternating = value
    }
    return states
}

export const updatePosition = (id: number, x: number, y: number, states: State[]) => {
    let stateIndex = states.findIndex(s => s.id === id)
    if (stateIndex !== -1) {
        states[stateIndex].x = x
        states[stateIndex].y = y
    }
    return states
}

export const add = (states: State[]): State[] => {
  
    let stateId = 0
    if (states.length !== 0) {
      stateId = states[states.length - 1].id + 1
    }
  
    states.push({id: stateId, name: 'q' + stateId, initial: false, accepting: false, alternating: false, x: 0, y: 0})
    return states
  }