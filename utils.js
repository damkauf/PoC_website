getDateTime = function () {
    let now = new Date();

    /*
    //"2021-04-28T22:11:28.257+03:00";
    let now1 = new Date();
    fecha = String(now1);
    console.log("La fecha es: ",fecha);
    //fecha = now1.substring(now1.length-2,now1.length);

    console.log(now1);
    console.log(now);
*/
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    (month.toString().length == 1) ? month = '0' + month : '';
    (day.toString().length == 1) ? day = '0' + day : '';
    (hour.toString().length == 1) ? hour = '0' + hour : '';
    (minute.toString().length == 1) ? minute = '0' + minute : '';
    (second.toString().length == 1) ? second = '0' + second : '';

    let dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

module.exports = { getDateTime };
