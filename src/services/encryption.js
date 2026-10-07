const encoder = new TextEncoder()

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)

  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64)

  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

async function getKey() {
  const secret = import.meta.env.VITE_AES_SECRET

  if (!secret) {
    throw new Error('VITE_AES_SECRET no está configurado')
  }

  const hash = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(secret)
  )

  return crypto.subtle.importKey(
    'raw',
    hash,
    {
      name: 'AES-GCM'
    },
    false,
    ['encrypt']
  )
}

export async function encryptAES(value) {
  const key = await getKey()

  const iv = crypto.getRandomValues(
    new Uint8Array(12)
  )

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128
    },
    key,
    encoder.encode(value)
  )

  return {
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(encrypted)
  }
}