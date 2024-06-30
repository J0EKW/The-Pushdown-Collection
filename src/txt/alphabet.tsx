import React, { useContext, useState } from 'react'
import { Alphabet as AlphabetType } from '../types'
import { OptionContext } from '../lib/OptionsContext'
import { Character } from './character'
import { AlphabetList } from './alphabetList'


type AlphabetProps = {
    alphabet: {[id: string]: string[]},
    colour:string,
    onAlphabetUpdate: Function
}

export const Alphabet = (props: AlphabetProps) => {
    const options = useContext(OptionContext)
    let alphabet = props.alphabet
    

    const addChar = (id: string) => {
        props.onAlphabetUpdate(id, '#', -1)
    }

    return (
        <div id='txtAlphabetWrapper' className={props.colour}>
            <h1 className={props.colour + ' txtAlphabetHeader'}>Alphabet</h1>
            <div className={props.colour + ' listWrapper'}>
                {(options['bookendInput'].value === true) && 
                <div className='bookendWrapper'>
                    <div className='bookendInput'>
                        Start: <Character char={alphabet['startChar'][0]} colour={props.colour} handleAlphabet={(char: string) => {props.onAlphabetUpdate('startChar', char, 0)}}/>
                    </div>
                    <div className='bookendInput'>
                        End: <Character char={alphabet['endChar'][0]} colour={props.colour} handleAlphabet={(char: string) => {props.onAlphabetUpdate('endChar', char, 0)}}/>
                    </div>
                </div>
                }
                {options['forceVisibly'].value ? 
                <>
                <AlphabetList label={'Call: '} list={alphabet['callChar']} colour={props.colour} handleAlphabet={(char: string, index: number) => {props.onAlphabetUpdate('callChar', char, index)}} addChar={() => {addChar('callChar')}}/>
                <AlphabetList label={'Return: '} list={alphabet['returnChar']} colour={props.colour} handleAlphabet={(char: string, index: number) => {props.onAlphabetUpdate('returnChar', char, index)}} addChar={() => {addChar('returnChar')}}/>
                <AlphabetList label={'Internal: '} list={alphabet['internalChar']} colour={props.colour} handleAlphabet={(char: string, index: number) => {props.onAlphabetUpdate('internalChar', char, index)}} addChar={() => {addChar('internalChar')}}/>
                </> : 
                <AlphabetList label={''} list={alphabet['miscChar']} colour={props.colour} handleAlphabet={(char: string, index: number) => {props.onAlphabetUpdate('miscChar', char, index)}} addChar={() => {addChar('miscChar')}}/>
                }
            </div>
        </div>
    )
}