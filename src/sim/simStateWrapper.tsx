import React from 'react'
import { SimState } from './simState'
import { State, Traversal } from '../types'

type SimStateWrapperProps = {
  input: string,
  currentTraversals: Traversal[],
  states: State[],
  haltCond: boolean,
  setSelected: Function
}

export const SimStateWrapper = (props: SimStateWrapperProps) => {
  let stateNames = Array<string>(props.states.length)
  let index = 0
  props.states.forEach(s => {
    stateNames[s.id] = s.name
  });

  return (
    <div className='simStateWrapper'>
      { props.currentTraversals.map((x, i) => {
        let traversalHistory:string[] = []
        let currentState = props.states.find(s => s.id === x.stateId)
        let className = 'simState'
        let tempIndex = -1

        if (x.end === 0) {
          className = 'simState'
          tempIndex = i
        } else if (currentState?.accepting && ((props.haltCond && x.end === 1) || (!props.haltCond && x.end === 2))) {
          className = 'simState success'
        } else {
          className = 'simState fail'
        }

        x.history.forEach((x, i) => {
          if (x !== -1) {
            traversalHistory.push(stateNames[x])
          }
        })
        return (
          <SimState key={i} className={className} input={props.input} stateName={stateNames[x.stateId]} stateHistory={traversalHistory} haltCond={props.haltCond} stateAccept={props.states.find(s => s.id === x.stateId)?.accepting ?? false} traversal={x} index={tempIndex} setSelected={(value: number) => {props.setSelected(value)}} />
        )
      }) }
    </div>
  )
}
