// pages/api/events/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = req.body;

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        draft: form.draft,
        archived: form.archived
      })
      .select()
      .single();

    if (eventError) {
      throw eventError;
    }

    const { error: perfError } = await supabase.from('performances').insert({
      event_id: event.id,
      event_place_id: form.performance.event_place_id,
      date: form.performance.date,
      open_time: form.performance.open_time,
      start_time: form.performance.start_time,
      duration: form.performance.duration,
      break_time: form.performance.break_time
    });

    if (perfError) {
      throw perfError;
    }

    res.status(200).json({ message: 'Event and performance created successfully', eventId: event.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error creating event', details: err.message });
  }
}
