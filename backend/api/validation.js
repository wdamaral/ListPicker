module.exports = app => {
    function existsOrError(value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch(msg) {
            return
        }
    
        throw msg
    }
    
    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg
    }

    function isValidID(value, msg) {
        let rgx = new RegExp("^[1-9][0-9]*")
        if(!rgx.test(value)) throw msg
    }

    function isNumber(value, msg) {
        if(isNaN(value)) throw msg
        if(value <= 0) throw msg
    }
    
    return { existsOrError, 
        notExistsOrError, 
        equalsOrError, 
        isValidID,
        isNumber 
    }
}