import { useEffect, useState } from "react"
import { Character } from "./character"

type AlphabetListProps = {
    label : string,
    list : string[],
    colour : string,
    handleAlphabet : Function,
    addChar : Function
}

export const AlphabetList = (props: AlphabetListProps) => {
    let aList = props.list
    let elems = aList.map((x, i) => {
        return (
        <><Character 
            char={x}
            colour={props.colour}
            handleAlphabet={(char: string) => {props.handleAlphabet(char, i)}}/> ,</>
        )})

    const handleAddChar = () => {
        props.addChar()
    }

    return (
        <div className='alphabet'>
            {props.label}
            {elems}
            <button className={props.colour + ' charAdd'} title={'Add new character'} onClick={() => {handleAddChar()}}>+</button>
        </div>
        )
}