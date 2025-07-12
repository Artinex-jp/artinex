import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { formatDate } from "../../utils/formatDate"
import Badge from "../ui/Badge"
import LoadingOverlay from "../LoadingOverlay";

type OrderItem = { itemId: string; quantity: number };
type ReservationForm = {
  customer: { lastName: string; firstName: string; email: string; tel: string };
  paymentMethod: string;
  amountTotal: number;
  orderItem: OrderItem[];
	message?: string;
};

export default function ReservationModal({
  event,
  form,
  setForm,
  quantities,
  setQuantities,
  onClose,
}: {
  event: any;
  form: ReservationForm;
  setForm: Dispatch<SetStateAction<ReservationForm>>;
  quantities: { [itemId: string]: number };
  setQuantities: Dispatch<SetStateAction<{ [itemId: string]: number }>>;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
	const [isLoading, setIsLoading] = useState(false);

  const prepareOrder = () => {
    const orderItem = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    const amountTotal = event.performances.flatMap((p: any) => p.performanceItems)
      .reduce((total: number, pi: any) => {
        const q = quantities[pi.item.id] || 0;
        return total + pi.item.price * q;
      }, 0);

    setForm(prev => ({ ...prev, amountTotal, orderItem }));
    setStep("confirm");
  };

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/post-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const result = await res.json();

			if (form.paymentMethod === "オンライン決済") {
				const stripeRes = await fetch("/api/create-checkout-session", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(result),
				});
				const { url } = await stripeRes.json();

				await fetch("/api/send-payment-link", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ form, event, stripeUrl: url }),
				});
			} else {
				await fetch("/api/send-payment-link", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ form, event }),
				});
			}

			if (result.success) {
				setStep("done");
			}
		} catch (error) {
			console.error("予約処理中にエラーが発生しました:", error);
			alert("予約処理に失敗しました。もう一度お試しください。");
		} finally {
			setIsLoading(false);
		}
	};

	const availableMethods = [
		event.allowBankTransfer && "銀行振り込み",
		event.allowCashOnSite && "当日現金支払い",
		event.allowOnlinePayment && "オンライン決済",
	].filter(Boolean);

  return (
    <div
			className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
			onClick={onClose}
		>
      <div
				className="bg-white p-4 rounded max-w-2xl w-full"
				onClick={e => e.stopPropagation()}
			>
				{isLoading && <LoadingOverlay />}
        {step === "form" && (
          <>
            <h2 className="text-xl font-bold mb-4">予約フォーム</h2>
						<div className="grid grid-cols-[7em_1fr] gap-2 items-center">
							<label>お名前</label>
							<div className="flex gap-4">
								<input
									placeholder="姓"
									className="border w-full mb-2"
									value={form.customer.lastName}
									onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, lastName: e.target.value } }))}
								/>
								<input
									placeholder="名"
									className="border w-full mb-2"
									value={form.customer.firstName}
									onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, firstName: e.target.value } }))}
								/>
							</div>
							<label>メールアドレス</label>
							<div>
								<input
									placeholder="メールアドレス"
									className="border w-full mb-2"
									value={form.customer.email}
									onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, email: e.target.value } }))}
								/>
							</div>
							<label>電話番号</label>
							<div>
								<input
									placeholder="電話番号"
									className="border w-full mb-2"
									value={form.customer.tel}
									onChange={e => setForm(f => ({ ...f, customer: { ...f.customer, tel: e.target.value } }))}
								/>
							</div>
							{availableMethods.length > 0 && (
								<>
									<label className="block font-semibold mb-1">お支払い方法</label>
									<div className="flex flex-col md:flex-row gap-2">
										{availableMethods.map((method) => (
											<label key={method} className="block">
												<input
													type="radio"
													name="paymentMethod"
													value={method}
													checked={form.paymentMethod === method}
													onChange={() => setForm(f => ({ ...f, paymentMethod: method }))}
													className="hidden"
												/>

												<div
													className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer border transition
														${form.paymentMethod === method
															? "bg-green-50 border-green-500 text-green-800"
															: "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"}`}
												>
													<div className="flex items-center gap-3">
														<div
															className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition
																${form.paymentMethod === method ? "bg-green-500 border-green-500" : "border-gray-400"}`}
														>
															{form.paymentMethod === method && (
																<svg
																	className="w-3 h-3 text-white"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="3"
																	viewBox="0 0 24 24"
																>
																	<path d="M5 13l4 4L19 7" />
																</svg>
															)}
														</div>
														<span className="text-sm">{method}</span>
													</div>
												</div>
											</label>
										))}
									</div>
								</>
							)}
							<label>メッセージ</label>
							<div>
								<textarea
									placeholder="ご質問や連絡事項などがあればご記入ください"
									className="border w-full mt-2"
									rows={3}
									value={(form as any).message || ""}
									onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
								/>
							</div>
						</div>
						<hr className="my-2" />

						{event.performances.flatMap((p: any) =>
							p.performanceItems.map((pi: any) => {
								const item = pi.item;
								const count = quantities[item.id] || 0;
								return (
									<>
										<div key={item.id} className="flex justify-between items-center mb-2 text-sm space-x-2 md:mx-4">
											<div>
												<div>¥{item.price.toLocaleString()}</div>
												<Badge>{item.type}</Badge>
											</div>
											<div>
												<div>{formatDate(p.date, "YYYY年M月D日")}　{formatDate(p.startTime, "hh:mm開演")}</div>
												<div>{p.eventPlace.name}</div>
											</div>
											<div className="flex items-center space-x-1">
												<button
													type="button"
													className={`flex items-center justify-center w-8 h-8 border border-gray-500 bg-white text-gray-800 font-bold rounded hover:bg-gray-100 disabled:bg-gray-100 disabled:border-gray-200`}
													disabled={count <= 0}
													onClick={() =>
														setQuantities((q) => ({
															...q,
															[item.id]: Math.max(0, (q[item.id] || 0) - 1),
														}))
													}
													>
													−
												</button>
												<span className="w-8 text-center">{count}枚</span>
												<button
													type="button"
													className={`flex items-center justify-center w-8 h-8 border border-gray-500 bg-white text-gray-800 font-bold rounded hover:bg-gray-100 disabled:bg-gray-100 disabled:border-gray-200`}
													disabled={count >= 20}
													onClick={() =>
														setQuantities((q) => ({
															...q,
															[item.id]: Math.min(20, (q[item.id] || 0) + 1),
														}))
													}
													>
													＋
												</button>
											</div>
										</div>
										<hr/>
									</>
								);
							})
						)}


						<div className="text-right font-bold mt-4">
							合計金額: ¥
							{event.performances
								.flatMap((p: any) => p.performanceItems)
								.reduce((sum: number, pi: any) => {
									const item = pi.item;
									const qty = quantities[item.id] || 0;
									return sum + item.price * qty;
								}, 0)
								.toLocaleString()}
						</div>

						<div className="flex justify-end mt-4">
							<button
								className="bg-white text-gray-700 px-4 py-2 mr-2 border hover:bg-gray-100"
								onClick={onClose}
							>
								キャンセル
							</button>
							<button
								className={`px-4 py-2 text-white ${
									Object.values(quantities).some((v) => v > 0)
										? "bg-blue-600 hover:bg-blue-700"
										: "bg-gray-400 cursor-not-allowed"
								}`}
								onClick={prepareOrder}
								disabled={!Object.values(quantities).some((v) => v > 0 && form.customer.lastName && form.customer.firstName && form.customer.email)}
							>
								予約確認
							</button>
						</div>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold mb-4">予約内容の確認</h2>
            <p className="mb-2">お名前：{form.customer.lastName}&nbsp;{form.customer.firstName}</p>
            <p className="mb-2">メール：{form.customer.email}</p>
            <p className="mb-2">電話番号：{form.customer.tel}</p>
            <p className="mb-2">支払方法：{form.paymentMethod}</p>
						<p className="mb-2">メッセージ：{form.message || "【未入力】"}</p>
            <hr className="my-2" />
            {form.orderItem.map((oi: any) => {
              const item = event.performances
                .flatMap((p: any) => p.performanceItems)
                .find((pi: any) => pi.item.id === oi.itemId)?.item;
							const performance = event.performances
								.find((p: any) => p.performanceItems?.find((pi: any) => pi.itemId === item.id))
              return (
								<>
									<div key={oi.itemId} className="flex justify-between mb-1 text-sm md:text-base">
									<div>
										<div>¥{item.price.toLocaleString()}</div>
										<Badge>{item.type}</Badge>
									</div>
									<div>
										<div>{formatDate(performance.date, "YYYY年M月D日")}　{formatDate(performance.startTime, "hh:mm開演")}</div>
										<div>{performance.eventPlace.name}</div>
									</div>
										<span>¥{item?.price} × {oi.quantity}枚</span>
									</div>
									<hr/>
								</>
              );
            })}
            <div className="mt-4 font-bold text-right">合計：¥{form.amountTotal}</div>
            <div className="flex justify-end mt-4">
              <button className="bg-white text-gray-700 px-4 py-2 mr-2 border hover:bg-gray-100" onClick={() => setStep("form")}>戻る</button>
              <button className="bg-green-600 text-white px-4 py-2 hover:bg-green-700" onClick={handleSubmit}>予約確定</button>
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
