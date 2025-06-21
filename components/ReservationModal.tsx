import { useState } from "react";

export default function ReservationModal({ event, onClose }: { event: any; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");

  const [form, setForm] = useState({
    customer: { name: "", email: "", tel: "" },
    paymentMethod: "銀行振り込み",
    amountTotal: 0,
    orderItem: [],
  });

  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({});

  const prepareOrder = () => {
    const orderItem = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    const amountTotal = event.performances.flatMap((p: any) => p.performanceItem)
      .reduce((total: number, pi: any) => {
        const q = quantities[pi.item.id] || 0;
        return total + pi.item.price * q;
      }, 0);

    setForm((f) => ({ ...f, amountTotal, orderItem }));
    setStep("confirm");
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/post-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (result.success) {
      setStep("done");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-w-md w-full">
        {step === "form" && (
          <>
            <h2 className="text-xl font-bold mb-4">予約フォーム</h2>
            <input
              placeholder="お名前"
              className="border w-full mb-2"
              onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, name: e.target.value } }))}
            />
            <input
              placeholder="メールアドレス"
              className="border w-full mb-2"
              onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, email: e.target.value } }))}
            />
            <input
              placeholder="電話番号"
              className="border w-full mb-2"
              onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, tel: e.target.value } }))}
            />
            <div className="mb-2">
              <label className="block font-semibold mb-1">お支払い方法</label>
              <select
                className="border w-full"
                value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
              >
                <option value="銀行振り込み">銀行振り込み</option>
                <option value="当日現金支払い">当日現金支払い</option>
                <option value="オンライン決済">オンライン決済</option>
              </select>
            </div>
            <hr className="my-2" />
            {event.performances.flatMap((p: any) =>
              p.performanceItem.map((pi: any) => {
                const item = pi.item;
                return (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <div>{item.title}（¥{item.price}）</div>
                    <input
                      type="number"
                      min={0}
                      className="w-16 border"
                      onChange={(e) =>
                        setQuantities((q) => ({ ...q, [item.id]: parseInt(e.target.value || "0") }))
                      }
                    />
                  </div>
                );
              })
            )}
            <div className="flex justify-end mt-4">
              <button className="bg-gray-300 px-4 py-2 mr-2" onClick={onClose}>キャンセル</button>
              <button className="bg-blue-600 text-white px-4 py-2" onClick={prepareOrder}>予約確認</button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold mb-4">予約内容の確認</h2>
            <p className="mb-2">お名前：{form.customer.name}</p>
            <p className="mb-2">メール：{form.customer.email}</p>
            <p className="mb-2">電話番号：{form.customer.tel}</p>
            <p className="mb-2">支払方法：{form.paymentMethod}</p>
            <hr className="my-2" />
            {form.orderItem.map((oi: any) => {
              const item = event.performances
                .flatMap((p: any) => p.performanceItem)
                .find((pi: any) => pi.item.id === oi.itemId)?.item;
              return (
                <div key={oi.itemId} className="flex justify-between mb-1">
                  <span>{item?.title}</span>
                  <span>¥{item?.price} × {oi.quantity}</span>
                </div>
              );
            })}
            <div className="mt-4 font-bold text-right">合計：¥{form.amountTotal}</div>
            <div className="flex justify-end mt-4">
              <button className="bg-gray-300 px-4 py-2 mr-2" onClick={() => setStep("form")}>戻る</button>
              <button className="bg-green-600 text-white px-4 py-2" onClick={handleSubmit}>予約確定</button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <h2 className="text-xl font-bold mb-4">予約が完了しました！</h2>
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 text-white px-4 py-2" onClick={onClose}>閉じる</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
