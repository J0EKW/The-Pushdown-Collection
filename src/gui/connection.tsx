import React, { useEffect } from 'react'
import { Connection, State, Transition, Traversal } from '../types';

type GuiConnectionProps = {
  colour: String,
  connection: Connection,
  cState: State,
  nState: State,
  transitions: Transition[],
  stackCount: number,
  mirror: boolean,
  scale: number,
  offset: {x: number, y: number},
  width: number,
  height: number,
  traversals: Traversal[]
}

const stacksString = (stackCount: number, transition: Transition) => {
  let value = ""
  for (let index = 0; index < stackCount; index++) {
    value += String(", " + transition.cStack[index] + "/" + transition.nStack[index])
  }
  return value
}

export const GuiConnection = (props: GuiConnectionProps) => {
  let connection = props.connection
  let cState = props.cState
  let nState = props.nState
  let guiCState = document.getElementById('guiState' + cState.id)?.getBoundingClientRect()
  let guiNState = document.getElementById('guiState' + nState.id)?.getBoundingClientRect()
  let pathD = ""
  let textY = 0
  let active = props.traversals.filter(t => props.transitions.find(tr => tr.id === t.transitionId) !== undefined)

    if (guiCState !== undefined && guiNState !== undefined) {
      let adaptedCX = (cState.x * props.scale) + (props.width / 2) - props.offset.x
      let adaptedNX = (nState.x * props.scale) + (props.width / 2) - props.offset.x
      let adaptedCY = (cState.y * props.scale) + (props.height / 2) - props.offset.y
      let adaptedNY = (nState.y * props.scale) + (props.height / 2) - props.offset.y
      
      pathD = String("M " + 
      String(adaptedCX) + " " + 
      String(adaptedCY) + " L " + 
      String(adaptedNX) + " " + 
      String(adaptedNY))
      textY = (adaptedCY + (adaptedNY - adaptedCY) / 2)
  
      if (connection.cStateId === connection.nStateId) {
        pathD = String("M " + 
        String(adaptedCX) + " " + 
        String(adaptedCY) + " a " + (40 * props.scale) + "," + (40 * props.scale) + " 45 1 1 1 0")

        textY = (adaptedCY + (adaptedNY - adaptedCY) / 2) - (70 * props.scale)
      } else if (props.mirror) {
        
        pathD = String("M " + 
        String(adaptedCX) + "," + 
        String(adaptedCY + ((adaptedNY > adaptedCY ? 30 : -30) * props.scale)) + " Q " +
        String(adaptedCX + (adaptedNX - adaptedCX) / 2) + "," + 
        String(adaptedCY + (adaptedNY - adaptedCY) / 2 + ((adaptedNY > adaptedCY ? 150 : -150) * props.scale)) + " " + 
        String(adaptedNX) + "," +
        String(adaptedNY + ((adaptedNY > adaptedCY ? 30 : -30) * props.scale)))

        textY = (adaptedCY + (adaptedNY - adaptedCY) / 2) + ((adaptedNY > adaptedCY ? 100 : -90) * props.scale)
      }
      document.getElementById('path' + connection.id)?.setAttribute('d', pathD)

      return (
        <svg id={'connection' + connection.id} className='connection'>
          <path id={'path' + connection.id} d={pathD} markerEnd={connection.cStateId !== connection.nStateId ? 'url(#head)' : ''} strokeWidth={String(props.scale * 10)}/>
          {props.transitions.map((y, i) => {
                return(
                  <text id={'guiTransition' + y.id} className={active.find(a => a.transitionId === y.id) ? 'activeText' : 'nonactiveText'} filter={active.find(a => a.transitionId === y.id) ? "url(#active)" : "url(#solid)"} key={y.id} x={adaptedCX + (adaptedNX - adaptedCX) / 2} y={textY - (i * 25 * props.scale)} fontSize={String(20 * props.scale)} textAnchor='middle'>
                    <tspan >
                      {y.cInput + stacksString(props.stackCount, y)
                    }</tspan>
                  </text>
                );
                  })}
        </svg>
      );
    }
    return (<></>)
    
}
