const convertUTC = (dateStr) => {
    var date = new Date(new Date().toUTCString())
    if ( dateStr ) {
        date = new Date(new Date(dateStr).toUTCString())
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate() - 1).padStart(2, '0')}`
}

export {
    convertUTC
}