import { useState } from "react";

export default function EventWithPerformanceForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    draft: false,
    archived: false,
    performance: {
      date: "",
      open_time: "",
      start_time: "",
      duration: "",
      break_time: "",
      event_place_id: ""
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-6 bg-white p-6 rounded shadow max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-bold">イベント作成</h2>

      <input
        className="w-full border p-2"
        placeholder="イベントタイトル"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
      />

      <input
        className="w-full border p-2"
        placeholder="サブタイトル"
        value={form.subtitle}
        onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
      />

      <textarea
        className="w-full border p-2"
        placeholder="イベント説明"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />

      <h3 className="font-semibold mt-6">公演情報</h3>
      <div className="flex flex-row items-center">
        <div className="w-20">
          開場時刻
        </div>
      <input
        type="date"
        className="border p-2 w-full"
        value={form.performance.date}
        onChange={(e) =>
          setForm((f) => ({ ...f, performance: { ...f.performance, date: e.target.value } }))
        }
      />
      </div>
      <div className="flex flex-row items-center">
        <div className="w-20">
          開場時刻
        </div>
        <input
          type="time"
          className="border p-2 w-full"
          placeholder="開場時刻"
          value={form.performance.open_time}
          onChange={(e) =>
            setForm((f) => ({ ...f, performance: { ...f.performance, open_time: e.target.value } }))
          }
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="w-20">
          開演時刻
        </div>
        <input
          type="time"
          className="border p-2 w-full"
          placeholder="開演時刻"
          value={form.performance.start_time}
          onChange={(e) =>
            setForm((f) => ({ ...f, performance: { ...f.performance, start_time: e.target.value } }))
          }
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="w-20">
          上演時間
        </div>
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="上演時間（分）省略可"
          value={form.performance.duration}
          onChange={(e) =>
            setForm((f) => ({ ...f, performance: { ...f.performance, duration: e.target.value } }))
          }
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="w-20">
          休憩時間
        </div>
        <input
          type="number"
          className="border p-2 w-full"
          placeholder="休憩時間（分）省略可"
          value={form.performance.break_time}
          onChange={(e) =>
            setForm((f) => ({ ...f, performance: { ...f.performance, break_time: e.target.value } }))
          }
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        作成する
      </button>
    </form>
  );
}
