import axios from "axios";
import './ValuteInfo.sass'
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
} from 'chart.js';
import ValuteList from "../ValuteList";

Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);


export class ValuteInfo {


    courseChange(num) {
        if (num > 0) {
            return `<td class="modal_list__change grown">${ num } ▲</td>`
        } else if (num === '') {
            return ''
        } else
            return `<td class="modal_list__change fell">${num} ▼</td>`
    }
    renderList(rateList) {
        const modalList = document.querySelector('.modal__list')
        let modalListHTML = ''
        rateList.reverse()
        for (let i = 0; i < rateList.length; i++) {
            if (i < rateList.length - 1)
                rateList[i].change = ((rateList[i].rate - rateList[i + 1].rate) / rateList[i].rate) * 100
            else
                rateList[i].change = ''
        }
        rateList.forEach(({date, rate, change}) => {
            modalListHTML += `
                <tr class="modal_list__item">
                    <td class="modal_list__date">${date}</td>
                    <td class="modal_list__rate">${rate}</td>
                    ${this.courseChange(change)}
                </tr>`
        })
        modalList.innerHTML = `
            <table class="modal_list__table">
                
                    <tr class="modal_list__header">
                        <th>Дата</th>
                        <th>Курс ЦБ РФ</th>
                        <th>Изменение за день</th>
                    </tr>
                    ${modalListHTML}
                    
            </table>
        `

        console.log(rateList)
    }
    render(data, ticker) {

        this.renderList(data)
        const modal = document.querySelector('.modal')
        const modalList = document.querySelector('.modal__list')
        const plotModBtn = document.querySelector('.modal__plot_mod')
        const listModBtn = document.querySelector('.modal__list_mod')
        modal.style.display = 'block'
        let dates = [], rates = []
        data.forEach(({date, rate}) => {
            dates.push(date)
            rates.push(rate)
        })
        console.log(dates, rates)
        let minRate = Math.min(...rates) - 10 < 0 ? 0 : Math.min(...rates) - 10
        let maxRate = Math.max(...rates) + 15



        const chart = document.getElementById('modal__chart');
        const ctx = chart.getContext('2d')

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.reverse(),
                datasets: [{
                    label: ticker,
                    data: rates.reverse(),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: minRate,
                        max: maxRate,

                    }
                }
            }
        });

        modal.addEventListener('click', event => {
            let type = event.target.dataset.type

            console.log(type)
            if (type === 'close') {
                myChart.destroy()
                modal.style.display = 'none'
                modalList.style.display = 'none'
                plotModBtn.classList.add('active')
                listModBtn.classList.remove('active')
            }
            if (type === 'list-mod') {
                chart.style.display = 'none'
                modalList.style.display = 'block'
                listModBtn.classList.add('active')
                plotModBtn.classList.remove('active')

            }
            if (type === 'plot-mod'){
                modalList.style.display = 'none'
                chart.style.display = 'block'
                plotModBtn.classList.add('active')
                listModBtn.classList.remove('active')

            }
        })




    }


    async getRate(dayCount, dateList, rateList, ticker) {

        let date = dateList[dayCount]
        let month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
        let year = date.getFullYear()
        const link = `https://www.cbr-xml-daily.ru/archive/${year}/${month}/${day}/daily_json.js`
        let data = {}, response  = {}
        try {
            response = await axios(link)
            data = response.data
        } catch (e) {
            // rateList.push({
            //     date: `${day}.${month}.${year}`,
            //     rate: 'Данные не получены'
            // })
        }




        for (let dataKey in data.Valute) {
            if (dataKey === ticker) {
                rateList.push({
                    date: `${day}.${month}.${year}`,
                    rate: data.Valute[dataKey].Value
                })
            }
        }

        if (dayCount === 0) {
            this.render(rateList, ticker)
        }

        setTimeout(async () => {
            await this.getRate(dayCount - 1, dateList, rateList, ticker)
        }, 205)
    }

}

export default new ValuteInfo()