import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient (
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {data, error} = await supabase.from("customers").select("*").limit(1);
	if (error) {
		return res.status(500).json({error: error.message, url: process.env.NEXT_PUBLIC_SUPABASE_URL})
	}
	res.status(200).json({success: true, data})
}