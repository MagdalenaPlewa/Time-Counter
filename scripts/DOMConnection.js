const _getElemByAtt = (value, attribute) => {
    return document.querySelector(`[${attribute}="${value}"]`)
}

export const mapDomElements = (values, attribute) => {
    const _counterElem = {}
    for(const value of values){
        _counterElem[value] = _getElemByAtt(value, attribute)
    }
    return _counterElem
}