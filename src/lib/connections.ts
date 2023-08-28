import React from 'react'
import { Connection, Transition } from '../types'

export const add = (connections: Connection[], cStateId: number, nStateId: number, transitionId: number): Connection[] => {
    let id = 0
    if (connections.length > 0) {
        id = connections[connections.length - 1].id + 1
    }
    connections.push({
        id: id,
        cStateId: cStateId,
        nStateId: nStateId,
        transitionIds: [transitionId]
    })
    return connections
}

export const remove = (id: number, connections: Connection[]): Connection[] => {
    return connections.filter(c => c.id !== id)
}

export const removeTransition = (transition: Transition, connections: Connection[]): Connection[] => {
    let connectionIndex = connections.findIndex(c => c.cStateId === transition.cStateId && c.nStateId === transition.nStateId)
    if (connectionIndex !== -1) {
        if (connections[connectionIndex].transitionIds.length === 1) {
            connections = remove(connections[connectionIndex].id, connections)
        } else {
            connections[connectionIndex].transitionIds = connections[connectionIndex].transitionIds.filter(t => t !== transition.id)
        }
    }
    
    return connections
}

export const addTransition = (transition: Transition, connections: Connection[]): Connection[] => {
    let connectionIndex = connections.findIndex(c => c.cStateId === transition.cStateId && c.nStateId === transition.nStateId)
    if (connectionIndex === -1) {
        connections = add(connections, transition.cStateId, transition.nStateId, transition.id)
    } else {
        connections[connectionIndex].transitionIds.push(transition.id)
    }
    
    return connections
}