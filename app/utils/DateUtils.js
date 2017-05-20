export function getYearMonth(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    month = (month < 10 ? "0"+month : month)
    let yearMonth = year.toString() + month.toString()
    return yearMonth
}
export function yearMonth(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    return {year,month}
}
export function getYearMonthDay(){
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    let day = date.getDate()
    month = (month < 10 ? "0"+month : month)
    day = (day < 10 ? "0"+day : day)
    let yearMonth = year.toString() +'-'+ month.toString()+'-'+day.toString()
    return yearMonth
}

