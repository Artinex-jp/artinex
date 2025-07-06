// pages/admin/performance-pieces/new.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatFullName } from '@/utils/formatFullName';
import { toCamelCase } from '@/utils/toCamelCase';

export default function AddPerformancePiecesPage() {
  const [performances, setPerformances] = useState<any[]>([]);
  const [pieces, setPieces] = useState<any[]>([]);
  const [composers, setComposers] = useState<any[]>([]);
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<string>('');
  const [selectedPieceIds, setSelectedPieceIds] = useState<string[]>([]);
  const [newPiece, setNewPiece] = useState({ title: '', subtitle: '', opus: '', composer_id: '', notes: '' });
  const [isAddingPiece, setIsAddingPiece] = useState(false);

  useEffect(() => {
    supabase.from('performances').select('id, date, events(title)').then(({ data }) => setPerformances(toCamelCase(data) || []));
    fetchPieces();
    fetchComposers();
  }, []);

  const fetchPieces = async () => {
    const { data } = await supabase.from('pieces').select('*, composer: composer_id(*)');
    setPieces(toCamelCase(data) || []);
  };

  const fetchComposers = async () => {
    const { data } = await supabase.from('artists').select('*');
    setComposers(toCamelCase(data) || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerformanceId || selectedPieceIds.length === 0) return;

    const inserts = selectedPieceIds.map(pieceId => ({
      performance_id: selectedPerformanceId,
      piece_id: pieceId,
    }));

    const { error } = await supabase.from('performance_pieces').insert(inserts);
    if (error) {
      alert('登録に失敗しました');
    } else {
      alert('登録が完了しました');
    }
  };

  const handleAddNewPiece = async () => {
    if (!newPiece.title.trim()) return;
    const { data, error } = await supabase
      .from('pieces')
      .insert(newPiece)
      .select()
      .single();

    if (data) {
      setSelectedPieceIds((prev) => [...prev, data.id]);
      setNewPiece({ title: '', subtitle: '', opus: '', composer_id: '', notes: '' });
      setIsAddingPiece(false);
      fetchPieces();
    } else {
      alert('曲の追加に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-xl font-bold">公演に曲目を追加</h1>

      <div>
        <label className="block mb-1 font-semibold">公演を選択</label>
        <select
          value={selectedPerformanceId}
          onChange={(e) => setSelectedPerformanceId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- 公演を選択 --</option>
          {performances.map(p => (
            <option key={p.id} value={p.id}>
              {p.events?.title ?? '（タイトル未設定）'} - {p.date}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">追加する曲目（複数可）</label>
        <div className="space-y-2">
          {pieces.map(piece => {
            const checked = selectedPieceIds.includes(piece.id);
            return (
              <label key={piece.id} className={`checkbox-button ${checked ? 'checkbox-button-selected' : 'checkbox-button-unselected'}`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => {
                    setSelectedPieceIds(prev =>
                      checked ? prev.filter(id => id !== piece.id) : [...prev, piece.id]
                    );
                  }}
                />
                <span className="flex-1">{piece.title}</span>
                {piece.composer && <span className="flex-2 mr-3">{formatFullName(piece.composer)}</span>}
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

          {isAddingPiece ? (
            <div className="space-y-2 border p-3 rounded">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newPiece.title}
                onChange={(e) => setNewPiece({ ...newPiece, title: e.target.value })}
                placeholder="タイトル"
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newPiece.subtitle}
                onChange={(e) => setNewPiece({ ...newPiece, subtitle: e.target.value })}
                placeholder="副題"
              />
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newPiece.opus}
                onChange={(e) => setNewPiece({ ...newPiece, opus: e.target.value })}
                placeholder="作品番号"
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={newPiece.composer_id}
                onChange={(e) => setNewPiece({ ...newPiece, composer_id: e.target.value })}
              >
                <option value="">-- 作曲者を選択 --</option>
                {composers.map(c => (
                  <option key={c.id} value={c.id}>{c.nationality ? formatFullName(c) : c.firstName}</option>
                ))}
              </select>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newPiece.notes}
                onChange={(e) => setNewPiece({ ...newPiece, notes: e.target.value })}
                placeholder="注記"
              />
              <button
                type="button"
                className="bg-green-600 text-white px-3 py-2 rounded"
                onClick={handleAddNewPiece}
              >
                追加
              </button>
              <button
                type="button"
                className="px-3 py-2"
                onClick={() => setIsAddingPiece(false)}
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="text-sm"
              onClick={() => setIsAddingPiece(true)}
            >
              + 新しい曲目を追加
            </button>
          )}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        登録する
      </button>
    </form>
  );
}
