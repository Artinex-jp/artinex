import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { toCamelCase } from '@/utils/toCamelCase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' })
  }
  const { data, error } = await supabase
    .rpc('get_event_full_data', { event_id: id })
	console.log("API /api/event called with id:", req.query.id);
	console.log(toCamelCase(data?.[0] ?? {}));
	console.log(error);
  const result = toCamelCase(data?.[0] ?? {})
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(result)
}
