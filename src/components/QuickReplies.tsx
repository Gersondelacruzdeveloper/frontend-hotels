// Skeleton – fetch quick replies later; for now static examples:
const base = [
  { id: "qr1", title: "Check-out time", body: "Check-out is at 11:00 AM." },
  { id: "qr2", title: "Wi-Fi", body: "The Wi-Fi password is SUNRISE-2025." },
];

export default function QuickReplies({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="p-3 border-t bg-white flex gap-2 overflow-x-auto">
      {base.map((q) => (
        <button key={q.id} className="text-sm px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
          onClick={() => onPick(q.body)}>
          {q.title}
        </button>
      ))}
    </div>
  );
}
