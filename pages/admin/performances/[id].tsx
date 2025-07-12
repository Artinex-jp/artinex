import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { formatFullName } from '@/utils/formatFullName';
import { toCamelCase } from '@/utils/toCamelCase';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import Head from 'next/head';

export default function PerformanceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [performance, setPerformance] = useState<any>(null);
  const [performancePieces, setPerformancePieces] = useState<any[]>([]);
  const [performancePieceArtists, setPerformancePieceArtists] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [formState, setFormState] = useState<{ [key: string]: { artistId: string; role: string; notes: string } }>({});
  const [notesState, setNotesState] = useState<{ [key: string]: string }>({});
  const [showForm, setShowForm] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!id) return;

    supabase.from('performances').select('*, events(title)').eq('id', id).single()
      .then(({ data }) => setPerformance(toCamelCase(data)));

    supabase.from('performance_pieces').select('*, piece: piece_id(*)')
      .eq('performance_id', id).order('order_in_program', { ascending: true })
      .then(({ data }) => {
        const camelData = toCamelCase(data) || [];
        setPerformancePieces(camelData);
        const initialNotes: { [key: string]: string } = {};
        camelData.forEach((pp: any) => {
          initialNotes[pp.id] = pp.notes || '';
        });
        setNotesState(initialNotes);
      });

    supabase.from('performance_piece_artists')
      .select('*, artist: artist_id(*), performance_piece: performance_piece_id(performance_id)')
      .then(({ data }) => {
        const camelData = toCamelCase(data) || [];
        const filtered = camelData.filter((p : any) => p.performancePiece?.performanceId === id);
        setPerformancePieceArtists(filtered);
      });

    supabase.from('artists').select('*')
      .then(({ data }) => setArtists(toCamelCase(data) || []));
  }, [id]);

  const handleAddArtist = async (pieceId: string) => {
    const { artistId, role, notes } = formState[pieceId] || {};
    if (!artistId || !role) return;

    const { error } = await supabase.from('performance_piece_artists').insert({
      performance_piece_id: pieceId,
      artist_id: artistId,
      role,
      notes,
    });

    if (!error) {
      const { data: updated } = await supabase
        .from('performance_piece_artists')
        .select('*, artist: artist_id(*), performance_piece: performance_piece_id(performance_id)');
      const camelData = toCamelCase(updated) || [];
      const filtered = camelData.filter((p: any) => p.performancePiece?.performanceId === id);
      setPerformancePieceArtists(filtered);
      setFormState(prev => ({ ...prev, [pieceId]: { artistId: '', role: '', notes: '' } }));
      setShowForm(prev => ({ ...prev, [pieceId]: false }));
    } else {
      alert('追加に失敗しました');
    }
  };

  const handleNotesSave = async (pieceId: string) => {
    const newNotes = notesState[pieceId];
    const { error } = await supabase.from('performance_pieces').update({ notes: newNotes }).eq('id', pieceId);
    if (error) {
      alert('注記の保存に失敗しました');
    } else {
      alert('注記を保存しました');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(performancePieces);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const reordered = items.map((item, index) => ({ ...item, orderInProgram: index + 1 }));
    setPerformancePieces(reordered);

    const updates = reordered.map(({ id, orderInProgram }) =>
      supabase.from('performance_pieces').update({ order_in_program: orderInProgram }).eq('id', id)
    );

    await Promise.all(updates);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Head>
        <title>公演詳細｜Artinex</title>
        <meta name="description" content="公演詳細"/>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={"https://artinex.jp/admin/performances/" + performance.id}/>
        <meta property="og:title" content="公演詳細｜Artinex" />
        <meta property="og:description" content="公演詳細"/>
        <meta property="og:url" content={"https://artinex.jp/admin/performances/" + performance.id} />
        <meta property="og:type" content="website" />
      </Head>
      <h1 className="text-2xl font-bold">公演詳細</h1>

      {performance && (
        <section>
          <h2 className="text-xl font-semibold">{performance.events?.title} - {performance.date}</h2>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold">プログラム</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="program-list">
            {(provided) => (
              <ul className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                {performancePieces.map((pp, idx) => (
                  <Draggable key={pp.id} draggableId={pp.id} index={idx}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border rounded p-4 space-y-2 bg-white shadow"
                      >
                        <div className="font-bold">{idx + 1}. {pp.piece?.title}</div>
                        <div className="text-sm">
                          <textarea
                            className="border rounded w-full p-2 text-sm"
                            value={notesState[pp.id] || ''}
                            onChange={(e) => setNotesState(prev => ({ ...prev, [pp.id]: e.target.value }))}
                          />
                          <button
                            type="button"
                            onClick={() => handleNotesSave(pp.id)}
                            className="bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            注記を保存
                          </button>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">出演者</h3>
                          <ul className="text-sm list-disc list-inside">
                            {performancePieceArtists.filter(a => a.performancePieceId === pp.id).map(a => (
                              <li key={a.id}>{a.artist?.nationality ? formatFullName(a.artist) : `${a.artist?.lastName} ${a.artist?.firstName}`}（{a.role}）{a.notes && ` - ${a.notes}`}</li>
                            ))}
                          </ul>
                          {!showForm[pp.id] && (
                            <div className="mt-2">
                              <button
                                type="button"
                                onClick={() => setShowForm(prev => ({ ...prev, [pp.id]: !prev[pp.id] }))}
                                className="text-sm"
                              >
                                出演者を追加
                              </button>
                            </div>
                          )}
                          {showForm[pp.id] && (
                            <div className="mt-3 space-y-2">
                              <select
                                value={formState[pp.id]?.artistId || ''}
                                onChange={e => setFormState(prev => ({ ...prev, [pp.id]: { ...prev[pp.id], artistId: e.target.value } }))}
                                className="border rounded px-2 py-1 w-full"
                              >
                                <option value="">-- アーティストを選択 --</option>
                                {artists.map(a => (
                                  <option key={a.id} value={a.id}>{a.nationality ? formatFullName(a) : `${a.lastName} ${a.firstName}`}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="役割 (例: ピアノ)"
                                value={formState[pp.id]?.role || ''}
                                onChange={e => setFormState(prev => ({ ...prev, [pp.id]: { ...prev[pp.id], role: e.target.value } }))}
                                className="border rounded px-2 py-1 w-full"
                              />
                              <input
                                type="text"
                                placeholder="注記（任意）"
                                value={formState[pp.id]?.notes || ''}
                                onChange={e => setFormState(prev => ({ ...prev, [pp.id]: { ...prev[pp.id], notes: e.target.value } }))}
                                className="border rounded px-2 py-1 w-full"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAddArtist(pp.id)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                  保存
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowForm(prev => ({ ...prev, [pp.id]: false }))}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                                >
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </div>
  );
}
