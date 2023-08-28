import React, { useContext, useEffect, useState } from 'react'
import { Traversal } from '../types'
import { OptionContext } from '../lib/OptionsContext'

type SimStateProps = {
    className: string,
    input: string,
    stateName: string,
    stateHistory: string[],
    stateAccept: boolean,
    traversal: Traversal,
    index: number,
    haltCond: boolean,
    setSelected: Function
}

const iShapeMap = ['●', '◼', '▲', '◆', '○', '◻', '△', '◇']

export const SimState = (props: SimStateProps) => {
    let input = props.input + " "
    let inputHead = props.traversal.inputHead
    
    let preHead = input.slice(0, inputHead)
    let postHead = input.slice(inputHead + 1, input.length)
    let head = input[inputHead]
    const [selected, setSelected] = useState<boolean>(false)
    const options = useContext(OptionContext)

    const simStateHistory = document.querySelector(String('#simStateHistory' + props.index))
  if (simStateHistory !== null) {
    simStateHistory.scrollLeft = simStateHistory.scrollWidth
  }

  const toggleSelected = () => {
    let newSelected = !selected
    let newVal = -1
    if (newSelected) {
      newVal = props.traversal.id
    }
    console.log(newVal)
    props.setSelected(newVal)
    setSelected(newSelected)
  }

  return (
    <div id={'simState'+ props.traversal.id} className={props.className} onClick={() => toggleSelected()}>
        <div>{props.index !== -1 ? iShapeMap[props.index % 8] : <>&nbsp;</>}</div>
        <div id={'simStateHistory'+props.traversal.id} className='simStateHistory'>
          {props.stateHistory.map((x, i) => {
            return (
              <a key={i}>{x + " -> "}</a>
            )
          })}
          <a className='highlighted'>{props.stateName}</a>
        </div>
        <div>{preHead}<a className='highlighted'>{head === " " ? <>&nbsp;&nbsp;&nbsp;</> : head}</a>{postHead}</div>
        <div className='inputsWrapper'>
          {props.traversal.stack.map((x, i) => {
            if (i < options['stackCount'].value) {
              return (
                <div key={i}>{x.slice(0, x.length - 1)}<a className='highlighted'>{x[x.length - 1]}</a></div>
              )
            }
          })}
        </div>
    </div>
  )
}
