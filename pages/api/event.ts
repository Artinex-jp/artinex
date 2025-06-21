import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      performances (
        *,
        eventPlace: event_place_id (
          *
        ),
        performanceItem: performance_item (
          *,
          item: items (
            *
          )
        )
      )
    `)
    .eq('id', id)
    .single()
	console.log("API /api/event called with id:", req.query.id);
	console.log(data);
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
