import axios from "axios";

class GetDataAPI {
    async getData(url) {
        try {
            const response = await axios.get(url)
            return  response.data
        } catch (e) {
            console.error(e)
            return false
        }

    }




}

export const getDataAPI = new GetDataAPI();

