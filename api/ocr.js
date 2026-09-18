export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { image, mediaType } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
          { type: 'text', text: 'Esta é uma planilha de controle de portaria de veículos. Extraia TODOS os dados e retorne APENAS um JSON array sem markdown, sem explicação. Cada objeto deve ter: {"romaneio":"","km_saida":"","km_retorno":"","h_saida":"","h_retorno":"","motorista":"","vda":""}. Use string vazia para campos não encontrados. Horários no formato HH:MM. KM sem pontos nem vírgulas.' }
        ]
      }]
    })
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
