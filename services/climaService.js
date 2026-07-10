const axios = require('axios');

async function obtenerClimaPorCiudad(ciudad) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    const error = new Error('No está configurada la API key del clima');
    error.statusCode = 502;
    throw error;
  }

  try {
    const respuesta = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: ciudad,
        appid: apiKey,
        units: 'metric',
        lang: 'es'
      },
      timeout: 5000
    });

    const datos = respuesta.data;

    return {
      ciudad: datos.name,
      pais: datos.sys.country,
      temperatura: datos.main.temp,
      sensacionTermica: datos.main.feels_like,
      humedad: datos.main.humidity,
      descripcion: datos.weather[0].description,
      viento: datos.wind.speed
    };
  } catch (error) {
    const nuevoError = new Error('No se pudo obtener el clima desde el servicio externo');
    nuevoError.statusCode = 502;
    throw nuevoError;
  }
}

module.exports = {
  obtenerClimaPorCiudad
};