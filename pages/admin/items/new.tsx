// pages/admin/items/new.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Supabase client
import { v4 as uuidv4 } from "uuid";

export default function NewItemPage() {
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number | undefined>();
  const [note, setNote] = useState("");
  const [performances, setPerformances] = useState<any[]>([]);
  const [selectedPerformanceIds, setSelectedPerformanceIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchPerformances = async () => {
      const { data } = await supabase
        .from("performances")
        .select("id, date, events(title)")
        .order("date");

      setPerformances(data || []);
    };

    fetchPerformances();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: item, error } = await supabase
      .from("items")
      .insert({ type, price, note })
      .select()
      .single();

    if (item && selectedPerformanceIds.length) {
      await supabase.from("performance_items").insert(
        selectedPerformanceIds.map((performance_id) => ({
          performance_id,
          item_id: item.id,
        }))
      );
    }

    alert("アイテムが作成されました");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold">アイテム作成</h1>

      <input
        type="text"
        placeholder="種別（例：一般、学生）"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="価格（円）"
        value={price ?? ""}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full border rounded p-2"
        required
      />
      <textarea
        placeholder="注記（任意）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div>
        <label className="font-semibold">このチケット1枚で参加可能な公演</label>
        <div className="space-y-1 mt-1">
        {performances.map((p) => {
          const checked = selectedPerformanceIds.includes(p.id);
          return (
            <label
              key={p.id}
              className={`checkbox-button ${checked ? 'checkbox-button-selected' : 'checkbox-button-unselected'}`}
            >
              <input
                type="checkbox"
                value={p.id}
                checked={checked}
                onChange={(e) =>
                  setSelectedPerformanceIds((prev) =>
                    e.target.checked
                      ? [...prev, p.id]
                      : prev.filter((id) => id !== p.id)
                  )
                }
                className="hidden"
              />
              <span className="flex-1">
                {p.events?.title ?? '（タイトル未設定）'} - {p.date}
              </span>
              <span className={`checkbox-icon ${checked ? 'checkbox-icon-selected' : 'checkbox-icon-unselected'}`}>
                {checked && (
                  <svg className="checkbox-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </label>
          );
        })}

        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        作成
      </button>
    </form>
  );
}
