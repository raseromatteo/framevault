export default async function handler(req, res) {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'Path mancante' });

    // Prova prima con il nome as-is, poi con .JPG maiuscolo
    const urls = [
      `https://grmfoto.myds.me/framevault-media/anteprime/catalogo/${path}`,
      `https://grmfoto.myds.me/framevault-media/anteprime/catalogo/${path.replace('.jpg', '.JPG')}`,
      `https://grmfoto.myds.me/framevault-media/anteprime/catalogo/${path.toUpperCase()}`,
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
