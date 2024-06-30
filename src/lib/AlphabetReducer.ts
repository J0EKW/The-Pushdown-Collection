
const alphabetReducer = (alphabet: {[id: string]: string[]}, action: {type: string, id: string, params: any}) => {
    
    switch (action.type) {
        case 'add' : {
            let newAlphabet = {...alphabet}
            let { char, index } = action.params

            if (typeof char === "string" && typeof index === "number") {
                let duplicates = newAlphabet['allChar'].filter(c => {return (c === char)})
                if ((char !== "" && duplicates.length > 0) || (char === "" && duplicates.length > 1)) {
                    console.log("Duplicate characters are not allowed")
                    return alphabet
                }
                newAlphabet[action.id].push(char)
                newAlphabet['allChar'].push(char)
            }
            return newAlphabet
        }
        case 'remove' : {
            let newAlphabet = {...alphabet}
            let { char, index } = action.params
            if (typeof index === "number") {
                let oldChar = newAlphabet[action.id][index]
                newAlphabet[action.id] = newAlphabet[action.id].filter(c => c !== newAlphabet[action.id][index])
                newAlphabet['allChar'] = [...newAlphabet['allChar'].filter(c => {return (c !== oldChar)})]
            }

            return newAlphabet
        }
        case 'update' : {
            let newAlphabet = {...alphabet}
            let { char, index } = action.params

            if (typeof char === "string" && typeof index === "number") {
                let duplicates = newAlphabet['allChar'].filter(c => {return (c === char)})
                if (duplicates.length > 0) {
                    console.log("Duplicate characters are not allowed")
                    return alphabet
                }
                let oldChar = newAlphabet[action.id][index]
                let allIndex = newAlphabet['allChar'].indexOf(oldChar)
                newAlphabet[action.id][index] = char
                newAlphabet['allChar'][allIndex] = char
            }

            return newAlphabet
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export default alphabetReducer