import axios from "axios"
const URL_PROVA = "http://localhost:5000/prova"

export const getProva = async () => {
  try {
    const res = await axios.get(URL_PROVA);
    return res.data;
  }
  catch(error) {
    console.log(error.message);
  }

}
