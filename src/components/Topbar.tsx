import { useDispatch, useSelector } from "react-redux";
import { LogOut, ChevronDown, Wifi, WifiOff } from "lucide-react";
import { RootState } from "../app/store";
import { logoutThunk } from "../features/auth/authSlice";

type Props = {
  connected?: boolean;                 // pass from socket hook if you have it
  onSwitchHotel?: () => void;          // optional hotel switcher action
};

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function Topbar({ connected, onSwitchHotel }: Props) {
  const dispatch = useDispatch();
  // Pull hotel context from your store (adjust selectors to your app)
  const hotel = useSelector((s: RootState) => s.conversations.currentHotel);
  const user  = useSelector((s: RootState) => s.auth.user);

  const logoUrl = hotel?.logo || "";           // store this on Hotel if available
  const hotelName = hotel?.name || "MassLingo Hotels";

  return (
    <header className="h-14 bg-white border-b sticky top-0 z-40">
      <div className="h-14 max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* LEFT — Brand / Hotel */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${hotelName} logo`}
                className="h-8 w-8 rounded-md object-cover border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-md bg-indigo-600 text-white grid place-items-center font-semibold">
                {hotelName.slice(0,1)}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold leading-5 truncate">{hotelName}</div>
              <div className="text-[11px] text-slate-500 leading-4 truncate">
                Powered by <span className="font-medium">MassLingo</span>
              </div>
            </div>
          </div>

          {/* Switcher (optional) */}
          <button
            onClick={onSwitchHotel}
            className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700"
            title="Switch hotel"
          >
            Change
            <ChevronDown size={14} />
          </button>
        </div>

        {/* RIGHT — Status + User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection status */}
          <div
            className={cx(
              "hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border",
              connected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}
            title={connected ? "WebSocket connected" : "Reconnecting…"}
          >
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {connected ? "Online" : "Connecting…"}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 grid place-items-center text-xs text-slate-700">
                {user?.username?.slice(0,1)?.toUpperCase() || "U"}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium leading-4 truncate max-w-[160px]">
                  {user?.username || "Staff"}
                </div>
                <div className="text-[11px] text-slate-500 leading-4">Reception</div>
              </div>
            </div>

            <button
              onClick={() => dispatch(logoutThunk())}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 border border-slate-200 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
