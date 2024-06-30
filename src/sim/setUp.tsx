import React, { useState, useContext } from 'react'
import { OptionContext } from '../lib/OptionsContext'

type setUpProps = {
  colour: String,
  input: string,
  stacks: string[],
  alphabet: {[id: string]: string[]},
  onInputUpdate: Function
}

export const SetUp = (props: setUpProps) => {
    const [input, setInput] = useState<string>(props.input)
    const options = useContext(OptionContext)

    const handleInput = (e: any) => {
      if (e.key === 'Enter') {
        let simInput = input
        if (options['bookendInput'].value) {
          simInput = props.alphabet['startChar'] + input + props.alphabet['endChar']
        }
        props.onInputUpdate(simInput)
      }
    }

    return (
    <div className={props.colour + ' simSetUpWrapper'}>
        <h1 className={props.colour + ' txtTransitionHeader'}>Simulation</h1>
        <div className={props.colour + ' inputsWrapper'}>
          <div className={props.colour + ' simLabel'}>{'Input: ' + (options['bookendInput'].value ? props.alphabet['startChar'] : '')}<input type='text' className={props.colour + ' textInput'} onChange={(e) => {setInput(e.currentTarget.value)}} onKeyDown={(e) => {handleInput(e)}} />{(options['bookendInput'].value ? props.alphabet['endChar'] : '')}</div>
          <div className={props.colour + ' simLabel'}>{'Initial Stack: ' + props.stacks[0][0]}</div>
        </div>
    </div>
  )
}