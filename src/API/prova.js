import axios from "axios"
const URL_PROVA = "http://localhost:5001/prova" // TODO: 5000

export const getProva = async () => {
  try {
    const res = await axios.get(URL_PROVA);
    return res.data;
  }
  catch(error) {
    console.log(error.message);
  }

}
