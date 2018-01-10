export function getYearMonth() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = (month < 10 ? "0" + month : month)
    let yearMonth = year.toString() +'-'+ month.toString()
    return yearMonth
}

export function yearMonth() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    return { year, month }
}
export function getYearMonthDay(i = 0) {
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1 - i;
    let day = date.getDate() - 1;
    month = (month < 10 ? "0" + month : month)
    day = (day < 10 ? "0" + day : day)
    let yearMonth = year.toString() + '-' + month.toString() + '-' + day.toString()
    return yearMonth
}

export function getYearMonthDayKD(i = 0) {
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1 - i;
    let day = date.getDate();
    month = (month < 10 ? "0" + month : month)
    day = (day < 10 ? "0" + day : day)
    let yearMonth = year.toString() + '-' + month.toString() + '-' + day.toString()
    return yearMonth
}

export function getYearPreMonthDay() {
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth()+1;
    let day = date.getDate();
    month = (month < 10 ? "0" + month : month)
    day = (day < 10 ? "0" + day : day)
    let yearMonth = year.toString() + '-' + month.toString() + '-' + day.toString()
    return yearMonth
}

//当前月的区间
export function getMonth() {  
      // 获取当前月的第一天  
      let date = new Date();
      let year = date.getFullYear()
      let month = date.getMonth()+1;
      let day = date.getDate(); 
      month = (month < 10 ? "0" + month : month)
      let startDate = year.toString() + '-' + month.toString() + '-' + "01"
      let endDate = year+'-'+month+'-'+new Date(year,month,0).getDate();
      return {startDate,endDate}  
  }  

export function show() {
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours();       //获取当前小时数(0-23)
    var m = myDate.getMinutes();     //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

    var now = year + '-' + p(month) + "-" + p(date) + " " + p(h) + ':' + p(m) + ":" + p(s);
    return now;

}

export function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
}

function p(s) {
    return s < 10 ? '0' + s : s;
}

