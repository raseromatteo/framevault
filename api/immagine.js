export default async function handler(req, res) {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'Path mancante' });

    const BASE = 'https://grmfoto.myds.me/framevault-media/anteprime';

    // Prova tutti i percorsi possibili: stampe e diapositive, maiuscolo e minuscolo
    const urls = [
      // Stampe originali
      `${BASE}/catalogo/${path}`,
      `${BASE}/catalogo/${path.replace('.jpg', '.JPG')}`,
      `${BASE}/catalogo/${path.toUpperCase()}`,
      // Diapositive
      `${BASE}/diapositive/${path}`,
      `${BASE}/diapositive/${path.replace('.jpg', '.JPG')}`,
      `${BASE}/diapositive/${path.toUpperCase()}`,
    ];

    let response;
    for (const url of urls) {
      response = await fetch(url);
      if (response.ok) break;
    }

    if (!response || !response.ok) return res.status(404).end();

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).end();
  }
}
