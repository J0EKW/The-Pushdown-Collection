import { OptionType } from "../types";

const optionsReducer = (options: {[id: string]: OptionType<any>}, action: {type: string, id: string, value: any}) => {
    switch (action.type) {
        case 'set' : {
            if (action.value !== undefined) {
                let newOptions = {...options}
                newOptions[action.id].value = action.value
                return newOptions
            }
            return options
        }
        case 'reset' : {
            let newOptions = {...options}
            newOptions[action.id].value = options[action.id].base
            return newOptions
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export default optionsReducer