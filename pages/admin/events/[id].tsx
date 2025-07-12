import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toCamelCase } from '@/utils/toCamelCase';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { formatDate } from '@/utils/formatDate';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<any>(null);
  const [editableEvent, setEditableEvent] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [performances, setPerformances] = useState<any[]>([]);
  const [performanceItems, setPerformanceItems] = useState<any[]>([]);
  const [eventImages, setEventImages] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<{ title: string; price: number; note: string; performanceIds: string[] }>({
    title: '',
    price: 0,
    note: '',
    performanceIds: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [showImageForm, setShowImageForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  useEffect(() => {
    if (!id) return;

    supabase.from('events').select('*').eq('id', id).single().then(({ data }) => {
      const camel = toCamelCase(data);
      setEvent(camel);
      setEditableEvent(camel);
    });
    supabase.from('performances').select('*, eventPlace: event_place_id(*)').eq('event_id', id).then(({ data }) => setPerformances(toCamelCase(data) || []));
    supabase.from('performance_items').select('*, item: item_id(*), performance: performance_id(*)').then(({ data }) => {
      const all = toCamelCase(data) || [];
      const filtered = all.filter((pi: any) => pi.performance?.eventId === id);
      setPerformanceItems(filtered);
    });
    supabase.from('event_images').select('*').eq('event_id', id).then(({ data }) => setEventImages(toCamelCase(data) || []));
  }, [id]);

  const handleEventFieldChange = (field: string, value: any) => {
    setEditableEvent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEventSave = async () => {
    const { error } = await supabase
      .from('events')
      .update({
        title: editableEvent.title,
        subtitle: editableEvent.subtitle,
        description: editableEvent.description,
        draft: editableEvent.draft,
        archived: editableEvent.archived,
        is_hosted_by_artinex: editableEvent.isHostedByArtinex,
        sell_tickets_directly: editableEvent.sellTicketsDirectly,
        allow_bank_transfer: editableEvent.allowBankTransfer,
        allow_online_payment: editableEvent.allowOnlinePayment,
        allow_cash_on_site: editableEvent.allowCashOnSite,
        external_reservation_url: editableEvent.externalPurchaseUrl,
      })
      .eq('id', id);

    if (!error) {
      setEvent(editableEvent);
      setEditMode(false);
    } else {
      alert('保存に失敗しました');
    }
  };

  const handleItemCreate = async () => {
    if (!newItem.title || newItem.performanceIds.length === 0) return;
    const { data, error } = await supabase.from('items').insert({
      title: newItem.title,
      price: newItem.price,
      note: newItem.note,
    }).select().single();
    if (data && !error) {
      const inserts = newItem.performanceIds.map(pid => ({ performance_id: pid, item_id: data.id }));
      await supabase.from('performance_items').insert(inserts);
      alert('アイテムを追加しました');
      setNewItem({ title: '', price: 0, note: '', performanceIds: [] });
      setShowItemForm(false);
    } else {
      alert('追加に失敗しました');
    }
  };

  const handleItemDelete = async (pi: any) => {
    if (!confirm('このアイテムを削除しますか？')) return;
    await supabase.from('performance_items').delete()
      .eq('item_id', pi.item?.id).eq('performance_id', pi.performance?.id);
    const { data } = await supabase.from('performance_items').select('*, item: item_id(*), performance: performance_id(*)');
    const filtered = toCamelCase(data)?.filter((i: any) => i.performance?.eventId === id) || [];
    setPerformanceItems(filtered);
  };

  const handleImageUpload = async () => {
    if (!imageFile || !id) return;
    const ext = imageFile.name.split('.').pop();
    const safeName = `${uuidv4()}.${ext}`;
    const filePath = `${id}/${safeName}`;
    const { error: uploadError } = await supabase.storage.from('flyers').upload(filePath, imageFile);
    if (uploadError) return alert('アップロードに失敗しました');
    await supabase.from('event_images').insert({ event_id: id, image_path: filePath, alt_text: imageAlt });
    const { data } = await supabase.from('event_images').select('*').eq('event_id', id);
    setEventImages(toCamelCase(data || []));
    setImageFile(null);
    setImageAlt('');
    setShowImageForm(false);
  };

  const handleImageDelete = async (image: any) => {
    if (!confirm('この画像を削除しますか？')) return;
    await supabase.storage.from('flyers').remove([image.imagePath]);
    await supabase.from('event_images').delete().eq('id', image.id);
    const { data } = await supabase.from('event_images').select('*').eq('event_id', id);
    setEventImages(toCamelCase(data || []));
  };

  const handleImageDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const updated = Array.from(eventImages);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setEventImages(updated);
    for (let i = 0; i < updated.length; i++) {
      await supabase.from('event_images').update({ order: i + 1 }).eq('id', updated[i].id);
    }
  };

  const handlePerformanceDelete = async (perfId: string) => {
    if (!confirm('この公演を削除しますか？')) return;
    await supabase.from('performances').delete().eq('id', perfId);
    const { data } = await supabase.from('performances').select('*, eventPlace: event_place_id(*)').eq('event_id', id);
    setPerformances(toCamelCase(data || []));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">イベント詳細</h1>

      {/* イベント基本情報の編集 */}
      {event && (
        <section>
          <h2 className="text-xl font-semibold mb-2">イベント情報</h2>
          {editMode ? (
            <div className="space-y-2">
              <input value={editableEvent.title} onChange={e => handleEventFieldChange('title', e.target.value)} className="w-full border px-2 py-1 rounded" />
              <input value={editableEvent.subtitle} onChange={e => handleEventFieldChange('subtitle', e.target.value)} className="w-full border px-2 py-1 rounded" />
              <textarea value={editableEvent.description} onChange={e => handleEventFieldChange('description', e.target.value)} className="w-full border px-2 py-1 rounded" />
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.archived} onChange={e => handleEventFieldChange('archived', e.target.checked)} /> 削除済みか？</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.draft} onChange={e => handleEventFieldChange('draft', e.target.checked)} /> 下書きか？</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.isHostedByArtinex} onChange={e => handleEventFieldChange('isHostedByArtinex', e.target.checked)} /> Artinex主催</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.sellTicketsDirectly} onChange={e => handleEventFieldChange('sellTicketsDirectly', e.target.checked)} /> 自社販売</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.allowBankTransfer} onChange={e => handleEventFieldChange('allowBankTransfer', e.target.checked)} /> 銀行振込を許容</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.allowOnlinePayment} onChange={e => handleEventFieldChange('allowOnlinePayment', e.target.checked)} /> オンライン決済を許容</label>
              <label className="flex flex-row items-center gap-2"><input className="h-[14px] w-[14px]" type="checkbox" checked={editableEvent.allowCashOnSite} onChange={e => handleEventFieldChange('allowCashOnSite', e.target.checked)} /> 当日現金支払い</label>
              <input value={editableEvent.externalPurchaseUrl} onChange={e => handleEventFieldChange('externalPurchaseUrl', e.target.value)} placeholder="外部予約URL" className="w-full border px-2 py-1 rounded" />
              <div className="flex gap-2">
                <button onClick={handleEventSave} className="px-4 py-2 bg-green-600 text-white rounded">保存</button>
                <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 rounded">キャンセル</button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p>{event.subtitle}</p>
              <p className="whitespace-pre-line">{event.description}</p>
              <p>下書き: {event.draft ? 'はい' : 'いいえ'} / 公開停止: {event.archived ? 'はい' : 'いいえ'}</p>
              <button onClick={() => setEditMode(true)} className="text-white text-sm">編集</button>
            </div>
          )}
        </section>
      )}

      {/* 画像セクション */}
      <section>
        <h2 className="text-xl font-semibold mb-2">画像一覧</h2>
        <DragDropContext onDragEnd={handleImageDragEnd}>
          <Droppable droppableId="event-images" direction="horizontal">
            {(provided) => (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4" {...provided.droppableProps} ref={provided.innerRef}>
                {eventImages.map((img, index) => (
                  <Draggable key={img.id} draggableId={String(img.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border rounded p-2 bg-white shadow cursor-move">
                        <img src={supabase.storage.from('flyers').getPublicUrl(img.imagePath).data.publicUrl} alt={img.altText || ''} className="w-full h-auto" />
                        <p className="text-sm text-gray-600">{img.altText}</p>
                        <button onClick={() => handleImageDelete(img)} className="text-white bg-red-600 text-sm">削除</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {!showImageForm && <button onClick={() => setShowImageForm(true)}>画像を追加</button>}
        {showImageForm && (
          <div className="border mt-4 p-4 rounded space-y-2">
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
            <input type="text" placeholder="代替テキスト" value={imageAlt} onChange={e => setImageAlt(e.target.value)} className="w-full border px-2 py-1 rounded" />
            <div className="flex gap-4">
              <button onClick={handleImageUpload} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">画像をアップロード</button>
              <button onClick={() => setShowImageForm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">キャンセル</button>
            </div>
          </div>
        )}
      </section>

      {/* 公演一覧セクション */}
      <section>
        <h2 className="text-xl font-semibold">公演一覧</h2>
        <ul className="space-y-2">
          {performances.map(perf => (
            <li key={perf.id} className="border rounded p-3">
              <div className="text-sm text-gray-600">{perf.date}{perf.startTime ? formatDate(perf.startTime, "　開場h:mm　") : ""}{perf.startTime ? formatDate(perf.startTime, "　開演h:mm　") : ""}</div>
              <div className="flex justify-between">
                <a href={`/admin/performances/${perf.id}`} className="text-blue-600 underline">公演を開く</a>
                <button onClick={() => handlePerformanceDelete(perf.id)} className="text-white bg-red-600 text-sm">削除</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* アイテム一覧セクション */}
      <section>
        <h2 className="text-xl font-semibold mb-2">このイベントのアイテム一覧</h2>
        <ul className="space-y-2">
          {performanceItems.map((pi, index) => (
            <li key={index} className="border p-3 rounded flex justify-between">
              <div>{pi.item?.type}（{pi.item?.price}円） - 注記: {pi.item?.note}</div>
              <button onClick={() => handleItemDelete(pi)} className="text-white bg-red-600 text-sm">削除</button>
            </li>
          ))}
        </ul>
        {!showItemForm && <button onClick={() => setShowItemForm(true)}>アイテムを追加</button>}
        {showItemForm && (
          <div className="border mt-4 p-4 rounded space-y-2">
            <input type="text" placeholder="タイトル" className="w-full border px-2 py-1 rounded" value={newItem.title} onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))} />
            <input type="number" placeholder="価格" className="w-full border px-2 py-1 rounded" value={newItem.price} onChange={e => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))} />
            <textarea placeholder="注記" className="w-full border px-2 py-1 rounded" value={newItem.note} onChange={e => setNewItem(prev => ({ ...prev, note: e.target.value }))} />
            <div className="space-y-1">
              <p className="font-semibold">紐づける公演を選択</p>
              {performances.map(perf => {
                const checked = newItem.performanceIds.includes(perf.id);
                return (
                  <label key={perf.id} className={`block px-2 py-1 rounded cursor-pointer ${checked ? 'bg-blue-100' : 'bg-white'}`}>
                    <input type="checkbox" value={perf.id} checked={checked} onChange={(e) => {
                      setNewItem(prev => {
                        const updated = e.target.checked ? [...prev.performanceIds, perf.id] : prev.performanceIds.filter(id => id !== perf.id);
                        return { ...prev, performanceIds: updated };
                      });
                    }} className="mr-2" />
                    {perf.eventPlace?.name} - {perf.date}
                  </label>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button onClick={handleItemCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">アイテムを作成して追加</button>
              <button onClick={() => setShowItemForm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">キャンセル</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
