import "regenerator-runtime/runtime";
import App from "./src/components/App";
import {getDataAPI} from "./src/utils/getDataAPI";
import axios from "axios";


(async () => {
    await App.render()
})();



