export default async function handler(req, res) {
  try {
    const response = await fetch('https://grmfoto.myds.me/framevault-media/catalogo.json');
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore caricamento catalogo' });
  }
}
