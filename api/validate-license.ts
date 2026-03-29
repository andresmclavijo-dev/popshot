import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { licenseKey } = req.body
  if (!licenseKey) return res.status(400).json({ valid: false, error: 'No key provided' })

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: 'popshot-web',
      }),
    })

    const data = await response.json()

    if (data.activated || data.license_key?.status === 'active') {
      return res.status(200).json({ valid: true })
    }

    return res.status(200).json({ valid: false, error: 'Invalid or inactive license' })
  } catch {
    return res.status(500).json({ valid: false, error: 'Validation failed' })
  }
}
