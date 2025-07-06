import PerformanceForm from '@/components/features/EventWithPerformanceForm';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function NewPerformancePage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    const { data: insertedPerformance, error } = await supabase
      .from('performances')
      .insert({
        title: formData.title,
        open_time: formData.openTime,
        start_time: formData.startTime,
        event_place_id: formData.event_place_id,
      })
      .select()
      .single();

    if (error || !insertedPerformance) {
      alert('保存に失敗しました');
      return;
    }

    // アイテムを保存
    const performance_items = formData.items
      .filter((i: any) => i.quantity > 0)
      .map((i: any) => ({
        performance_id: insertedPerformance.id,
        item_id: i.item_id,
        quantity: i.quantity,
      }));

    if (performance_items.length > 0) {
      await supabase.from('performance_items').insert(performance_items);
    }

    router.push('/admin/performances'); // 一覧画面へ遷移
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">公演作成</h1>
      <PerformanceForm onSubmit={handleSubmit} />
    </div>
  );
}
