import axios from 'axios';

export async function photosFetch(url) {
  const response = await axios.get(url);
  return response.data;
}
