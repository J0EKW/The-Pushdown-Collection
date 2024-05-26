import React from 'react'
import { State, Traversal } from '../types'

type GuiStateProps = {
    colour: String,
    width: number,
    height: number,
    state: State,
    scale: number,
    offset: {x: number, y: number},
    onStatePosUpdate: Function,
    traversals: Traversal[]
}

export const GuiState = (props: GuiStateProps) => {
    let state = props.state
    let target = props.traversals.filter(t => t.stateId === state.id).length > 0
    

    if (state.alternating) {
        return(
        <svg id={'guiState' + state.id} className={'universal guiState'} x={"50%"} y={"50%"} width={'200px'} height={'200px'} transform={"translate(" + (((state.x - 100) * props.scale) - props.offset.x) + ", " + (((state.y - 100) * props.scale) - props.offset.y) + ") scale(" + props.scale + ")"} >
            {state.accepting && <rect id={'accept' + state.id} className={'alternating draggable svg'} x={"30%"} y={"30%"} width={"40%"} height={"40%"} strokeWidth="1%"/>}
            {state.initial && <path id={'start' + state.id} className={'initial'} d={"M20,70 L60,100 L20,130, Z"} strokeWidth="0%"/>}
            <rect id={'StateCircle' + state.id} className={'stateCircle draggable svg ' + (target === true ? 'target' : 'nontarget')} x={"33%"} y={"33%"} width={"34%"} height={"34%"} strokeWidth="1%"/>
            <text className={props.colour + ' svg '+ (target === true ? 'activeText' : 'nonactiveText')} x={"50%"} y={"50%"} fontSize='30' textAnchor='middle' transform={"translate(0, 8)"}>{state.name}</text>
        </svg>
        )
    }
    return (
        <svg id={'guiState' + state.id} className={'existential guiState'} x={"50%"} y={"50%"} width={'200px'} height={'200px'} transform={"translate(" + ((state.x - 100) * props.scale - props.offset.x) + ", " + (((state.y - 100) * props.scale - props.offset.y)) + ") scale(" + props.scale + ")"} >
            {state.accepting && <circle id={'accept' + state.id} className={'alternating draggable svg'} cx={"50%"} cy={"50%"} r={"26%"} strokeWidth="1%"/>}
            {state.initial && <path id={'start' + state.id} className={'initial'} d={"M20,70 L60,100 L20,130, Z"} strokeWidth="0%"/>}
            <circle id={'stateCircle' + state.id} className={'stateCircle draggable svg ' + (target === true ? 'target' : 'nontarget')} cx={"50%"} cy={"50%"} r={'20%'} strokeWidth="1%"/>
            <text className={props.colour + ' svg ' + (target === true ? 'activeText' : 'nonactiveText')} x={"50%"} y={"50%"} fontSize='30' textAnchor='middle' transform={"translate(0, 8)"}>{state.name}</text>
        </svg>
  )
}
