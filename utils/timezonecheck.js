const moment = require('moment')



module.exports = function timezonecheck() {
    const date = moment().format('d')
    // const date = moment().subtract(2, 'days').format('YYYY-MM-DD')
    const from = moment().format('X') - 50400;
    const to = moment().format('X') - 50399;
    // console.log('timezonecheck',from,to)
    // console.log('timezonecheck',moment.unix(from).format("LLL"),moment.unix(to).format('LLL'))
 
}