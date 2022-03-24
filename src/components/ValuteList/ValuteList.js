import './ValuteList.sass'
import {getDataAPI} from "../../utils/getDataAPI";
import ValuteInfo from "../ValuteInfo";

class ValuteList {

    courseChange(current, previous) {
        let per = ((current - previous) / current) * 100;
        if (current > previous) {

            return `<td class="valute_list__change grown">${ per } ▲</td>`
        } else
            return `<td class="valute_list__change fell">${per} ▼</td>`
    }

    async render() {
        const data = await getDataAPI.getData('https://www.cbr-xml-daily.ru/daily_json.js')
        const valuteList = data.Valute
        const valuteListNode = document.querySelector('#valute_list')
        let tableBody = ''
        console.log(data)
        let dateList = [];

        for (let i = 0; i < 10; i++) {
            let date = new Date()
            date.setDate(date.getDate() - i)
            dateList.push(date)
        }
        for (let ticker in valuteList) {
            let valute = valuteList[ticker]
            tableBody += `
                <tr class="valute_list__item" data-ticker="${ticker}">
                    <td class="valute_list__ticker">${valute.CharCode}
                        <span class="tooltip">${valute.Name}</span>
                    </td>
                    <td class="valute_list__rate">${valute.Value} </td>
                    ${this.courseChange(valute.Value, valute.Previous)}
                </tr>
            `
        }



        valuteListNode.innerHTML = `
            <table class="valute_list__table">
                    <tr class="valute_list__header">
                        <th>Код</th>
                        <th>Курс ЦБ РФ</th>
                        <th>Изиение за день</th>
                    </tr>
                    ${tableBody}
                    
            </table>
        `

        document.querySelectorAll('.valute_list__item').forEach(item => {
            let ticker = item.getAttribute('data-ticker')

            item.addEventListener('click', async event => {
                await ValuteInfo.getRate(9, dateList, [], ticker)
            })
        })



    }
}

export default new ValuteList()