import React, { useState } from 'react'
import { State } from '../types'
import '../App.css'
import { useContext } from 'react'
import { OptionContext } from '../lib/OptionsContext'

type StateProps = {
  state: State,
  index: number,
  colour: string,
  onRemove: Function,
  onNameUpdate: Function,
  onInitUpdate: Function,
  onAcceptUpdate: Function,
  onAlternateUpdate: Function
}

export const StateComponent = (props: StateProps) => {
  let state = props.state
  const [name, setName] = useState<string>(state.name)
  const options = useContext(OptionContext)

  const handleName = (e: any) => {
    if (e.key === 'Enter') {
      
      props.onNameUpdate(state.id, name)
    }
  }

  const toggleInit = () => {
    props.onInitUpdate(state.id, !state.initial)
  }

  const toggleAccept = () => {
    props.onAcceptUpdate(state.id, !state.accepting)
  }

  const toggleAlternating = () => {
    props.onAlternateUpdate(state.id, !state.alternating)
  }

  return (
    <div id={'state' + state.id} className={props.colour + ' txtState show'}>
      <input id='removeState' title={'Remove State ' + state.name} type= 'submit' className={props.colour + ' remove'} value='&times;' onClick={() => {props.onRemove(state.id)}}/>
      <input id='stateName' title={'State Name'} type='input' className={props.colour + ' boxInput'} value={name} onChange={(e) => setName(e.currentTarget.value)} onKeyDown={(e) => handleName(e)}/>
      <input id='stateInit' title={'Is ' + state.name + ' Initial?'} type='checkBox' checked={state.initial} onChange={() => {toggleInit()}}/>
      <input id='stateAccept' title={'Does ' + state.name + ' Accept?'} type='checkBox' checked={state.accepting} onChange={() => {toggleAccept()}}/>
      {(options['enableAlternating'].value === true) && <input id='stateAlternate' title={'Is ' + state.name + ' Universal?'} type='checkBox' checked={state.alternating} onChange={() => {toggleAlternating()}}/>}
    </div>
  )
}
