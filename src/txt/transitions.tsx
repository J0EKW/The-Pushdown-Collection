import React, { useEffect, useState } from 'react'
import { State, Transition } from '../types'
import TransitionComponent from './transition'
import '../App.css'
import { stat } from 'fs'

type TransitionsProps = {
    transitions: Transition[],
    states: State[],
    stackCount: number,
    colour: string,
    onRemove: Function,
    onCInputUpdate: Function,
    onCStateUpdate: Function,
    onNStateUpdate: Function,
    onCStackUpdate: Function,
    onNStackUpdate: Function,
    onNInputHeadUpdate: Function,
    onAdd: Function
}

export const Transitions = (props: TransitionsProps) => {
    let transitions = props.transitions
    let states = props.states

    const removeTransition = (id: number) => {
        document.getElementById('transition' + id)?.setAttribute('class', props.colour + 'transition hide')
        let children = document.getElementById('transition' + id)?.children
        if (children !== undefined) {
            for (let index = 0; index < children.length; index++) {
                const element = children[index];
                element.className += ' hide'
            }
        }
        setTimeout(() => {
            props.onRemove(id)
        }, 190)
    }

    const addTransition = () => {
        props.onAdd()
    }

    let elems = transitions.map((x, i) => {
        let cState = states.find(s => s.id === x.cStateId)?.name
        let nState = states.find(s => s.id === x.nStateId)?.name
        if (cState === undefined || nState === undefined) {
            cState = "N/A"
            nState = "N/A"
        }
        return (
            <TransitionComponent
            key={x.id}
            transition={x}
            index={i}
            cState={cState}
            nState={nState}
            colour={props.colour}
            stackCount={props.stackCount}
            onRemove={(id: number) => {removeTransition(id)}}
            onCInputUpdate={(id: number, value: string) => {props.onCInputUpdate(id, value)}}
            onCStateUpdate={(id: number, name: string) => {props.onCStateUpdate(id, name)}}
            onNStateUpdate={(id: number, name: string) => {props.onNStateUpdate(id, name)}}
            onCStackUpdate={(id: number, value: string, index: number) => {props.onCStackUpdate(id, value, index)}}
            onNStackUpdate={(id: number, value: string, index: number) => {props.onNStackUpdate(id, value, index)}}
            onNInputHeadUpdate={(id: number, value: number) => {props.onNInputHeadUpdate(id, value)}}/>
            
           )
    })

    return (
        <div className={props.colour + ' txtTransitionsWrapper'}>
            <h1 className={props.colour + ' txtTransitionHeader'}>Transitions <button className={props.colour + ' add'} title={'Add new transition'} onClick={() => {addTransition()}}>+</button></h1>
            <div className={props.colour + ' listWrapper'}>
                {elems}
            </div>
        </div>
    )
}
