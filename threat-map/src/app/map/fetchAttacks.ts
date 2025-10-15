
import { AlertResponse, AlertRecord } from './alerts_type';

const url = 'https://api.abuseipdb.com/api/v2/blacklist';

export async function getdata() {
  const request = new Request(url, {
    method: 'GET',
    headers: {
      'Key': '45dd602e3d8b497f14500edee23ee4fdfbfb138addcc42b49b4ae8de7cc94fc7d04fcaba6e2ad894',
      'Accept': 'application/json'
    }
  });

  try {
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Erreur lors du fetch :', error);
    return null;
  }
}



