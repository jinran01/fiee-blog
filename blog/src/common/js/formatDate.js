// 直接传入原始时间节点
export function formatDate(time,format) {
  //创建日期对象
  let date = Date.parse(time);
  date = new Date(date)
  // console.log(date)
  //格式化年份
  let year = date.getFullYear().toString();
  if (/(Y+)/.test(format)) {
    //获取匹配组的内容
    var content = RegExp.$1;
    format = format.replace(content, year.slice(year.length - content.length));
  }
  //格式化月份、日份、时、分、秒
  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
  for (let key in o) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    //
    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
    }
  }
  return format;
}

