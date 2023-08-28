import React, { useState } from 'react'

type setUpProps = {
  input: string,
  stacks: string[],
  onInputUpdate: Function,
  onStacksUpdate: Function
}

export const SetUp = (props: setUpProps) => {
    const [input, setInput] = useState<string>(props.input)
    const [stacks, setStacks] = useState<string[]>(props.stacks)

    const handleInput = (e: any) => {
      if (e.key === 'Enter') {
        props.onInputUpdate(input)
      }
    }

    const handleStack = (e: any) => {
      if (e.key === 'Enter') {
          props.onStacksUpdate(stacks)
      }
  }

  const updateStack = (value: string, index: number) => {
      let newStacks = [...stacks]
      newStacks[index] = value
      setStacks(newStacks)
  }

    return (
    <div className='simSetUpWrapper'>
        <h1 className='txtTransitionHeader'>Simulation</h1>
        <div className='inputsWrapper'>
          <div className='simLabel'>Input<input type='text' className='textInput' value={input} onChange={(e) => {setInput(e.currentTarget.value)}} onKeyDown={(e) => {handleInput(e)}} /></div>
          {stacks.map((x, i) => {
            return (
                <div key={i} className='simLabel'>{'Stack ' + (i + 1)}<input type='text' className='textInput' value={x} onChange={(e) => {updateStack(e.currentTarget.value, i)}} onKeyDown={(e) => {handleStack(e)}} /></div>
              )
          })}
        </div>
    </div>
  )
}