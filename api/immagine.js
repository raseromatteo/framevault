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

    if (!response || !response.ok) {
      // Cache breve sui 404 per non ripetere i tentativi al NAS troppo spesso
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.status(404).end();
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    // Le anteprime non cambiano: cache lunga su CDN + browser per ridurre il Fast Origin Transfer.
    // Una volta scaricata dal NAS, l'immagine viene servita dalla cache senza ripassare dall'origine.
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).end();
  }
}
