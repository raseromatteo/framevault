export default async function handler(req, res) {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'Path mancante' });

    const url = `https://grmfoto.myds.me/framevault-media/anteprime/catalogo/${path}`;
    const response = await fetch(url);

    if (!response.ok) return res.status(404).end();

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).end();
  }
}
