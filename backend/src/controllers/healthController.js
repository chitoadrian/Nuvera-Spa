export function getHealth(_request, response) {
  response.status(200).json({
    ok: true,
    message: 'API de Nuvéra Spa funcionando',
  })
}

