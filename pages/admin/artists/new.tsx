// pages/admin/artists/new.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddArtistPage() {
  const [form, setForm] = useState({
    last_name: '',
    middle_name: '',
    first_name: '',
    birth_year: '',
    death_year: '',
    nationality: '',
    title: '',
    notes: '',
    website_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('artists').insert({
      ...form,
      birth_year: form.birth_year ? Number(form.birth_year) : null,
      death_year: form.death_year ? Number(form.death_year) : null,
    });

    if (error) {
      alert('登録に失敗しました');
    } else {
      alert('登録が完了しました');
      setForm({
        last_name: '',
        middle_name: '',
        first_name: '',
        birth_year: '',
        death_year: '',
        nationality: '',
        title: '',
        notes: '',
        website_url: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-xl font-bold">アーティスト追加</h1>

      <div>
        <label className="block mb-1 font-semibold">姓</label>
        <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">ミドルネーム</label>
        <input type="text" name="middle_name" value={form.middle_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">名</label>
        <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">生年</label>
        <input type="text" name="birth_year" value={form.birth_year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">没年</label>
        <input type="text" name="death_year" value={form.death_year} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">国籍</label>
        <input type="text" name="nationality" value={form.nationality} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">肩書き</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">ウェブサイト</label>
        <input type="text" name="website_url" value={form.website_url} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">注記</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        登録する
      </button>
    </form>
  );
} 
