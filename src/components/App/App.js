import ValuteList from "../ValuteList";
import './App.sass'
import ValuteInfo from "../ValuteInfo";

class App {
    async render() {
        await ValuteList.render()

    }
}

export default new App()