import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const { itemId } = req.query

  if (!itemId || typeof itemId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid itemId' })
  }

  const { data, error } = await supabase.rpc('get_item_remaining_quantity', {
    _item_id: itemId,
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ remainingQuantity: data })
}