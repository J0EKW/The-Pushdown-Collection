import React, { useContext, useState } from 'react'
import { Alphabet as AlphabetType } from '../types'
import { OptionContext } from '../lib/OptionsContext'
import { Character } from './character'


type AlphabetProps = {
    alphabet: AlphabetType,
    colour:string,
    onAlphabetUpdate: Function
}

export const Alphabet = (props: AlphabetProps) => {
    const options = useContext(OptionContext)
    const [tempAlpha, setTempAlpha] = useState<AlphabetType>(props.alphabet)
    const [tempChar, setTempChar] = useState<string>('')

    const handleTempAlphabet = (e: string, type: number, index: number) => {
        let newAlphabet = tempAlpha
        
        newAlphabet.allChars[index] = e
        switch (type) {
        case 0:
            newAlphabet.miscChars[index] = e
            break;
        case 1:
            newAlphabet.callChars[index] = e
            break;
        case 2:
            newAlphabet.returnChars[index] = e
            break;
        case 3:
            newAlphabet.internalChars[index] = e
            break;
        case 4:
            newAlphabet.startChar = e
            break;
        case 5:
            newAlphabet.endChar = e
            break;
        
        default:
            break;
        }
        console.log(String(e))
        setTempAlpha(newAlphabet)
    }

    const handleAlphabet = (e: any, type: number, char: string, index: number) => {
        if (e.key === 'Enter') {
            props.onAlphabetUpdate(type, char, index)
          }
    }

    return (
        <div id='txtAlphabetWrapper' className={props.colour}>
            <h1 className={props.colour + ' txtAlphabetHeader'}>Alphabet</h1>
            <div className={props.colour + ' listWrapper'}>
                {(options['bookendInput'].value === true) && 
                <div className='bookendWrapper'>
                    <div className='bookendInput'>
                        start: <Character char={options['inputFrontChar'].value} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 4, char, 0)}}/>
                    </div>
                    <div className='bookendInput'>
                        end: <Character char={options['inputEndChar'].value} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 5, char, 1)}}/>
                    </div>
                </div>
                }
                {options['forceVisibly'].value ? 
                <>
                <div className='alphabet'>
                    Call: {props.alphabet.callChars.map((x, i) => {return (<Character char={x} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 0, char, i + 2 + props.alphabet.miscChars.length)}}/>)})}
                </div>
                <div className='alphabet'>
                    Return: {props.alphabet.returnChars.map((x, i) => {return (<Character char={x} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 0, char, i + 2 + props.alphabet.miscChars.length + props.alphabet.callChars.length)}}/>)})}
                </div>
                <div className='alphabet'>
                    Internal: {props.alphabet.internalChars.map((x, i) => {return (<Character char={x} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 0, char, i + 2 + props.alphabet.miscChars.length + props.alphabet.callChars.length + props.alphabet.returnChars.length)}}/>)})}
                </div>
                </> : 
                <div className='alphabet'>
                    {tempAlpha.miscChars.map((x, i) => {return (<Character char={x} colour={props.colour} handleAlphabet={(e: any, char: string) => {handleAlphabet(e, 0, char, i + 2)}}/>)})}
                </div>
                }
            </div>
        </div>
    )
}