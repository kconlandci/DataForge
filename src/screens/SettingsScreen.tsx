import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Crown,
  Database,
  FileText,
  Mail,
  Scale,
  Star,
  Trash2,
} from "lucide-react";
import { Dialog } from "@capacitor/dialog";
import { Browser } from "@capacitor/browser";
import { useProgress } from "../hooks/useProgress";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { uid } = useAuth();
  const { resetProgress } = useProgress(uid);

  const handleResetProgress = async () => {
    try {
      const { value } = await Dialog.confirm({
        title: "Reset All Progress?",
        message:
          "This will clear all completed labs, scores, streaks, and XP. This cannot be undone.",
        okButtonTitle: "Reset Everything",
        cancelButtonTitle: "Cancel",
      });
      if (value) {
        resetProgress();
        navigate("/");
      }
    } catch {
      const confirmed = window.confirm(
        "Reset all progress? This cannot be undone."
      );
      if (confirmed) {
        resetProgress();
        navigate("/");
      }
    }
  };

  const openExternal = (url: string) => {
    Browser.open({ url }).catch(() => {
      window.location.href = url;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 pb-24">
      <div className="max-w-lg mx-auto pt-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
            <Database className="text-amber-400" size={28} />
          </div>
          <h1 className="text-xl font-bold text-white">DataForge</h1>
          <p className="text-xs text-slate-400 mt-1">DataForge: Data Training</p>
          <p className="text-[10px] text-slate-500 mt-1">v1.0.0</p>
          <p className="text-xs text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
            Build SQL, analytics, BI, and data pipeline instincts through
            scenario-driven labs.
          </p>
        </div>

        <section className="mb-6">
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            Premium
          </h2>
          <Link
            to="/upgrade"
            className="flex items-center justify-between bg-slate-800 rounded-xl p-4 min-h-[48px] active:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crown size={18} className="text-amber-400" />
              <span className="text-sm font-medium text-white">
                DataForge Premium
              </span>
            </div>
            <ChevronRight size={18} className="text-slate-500" />
          </Link>
        </section>

        <section className="mb-6">
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            Data
          </h2>
          <div className="space-y-1">
            <SettingsRow
              icon={<BarChart3 size={16} />}
              label="Usage Stats"
              to="/settings/analytics"
            />
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            Legal
          </h2>
          <div className="space-y-1">
            <SettingsRow
              icon={<FileText size={16} />}
              label="Privacy Policy"
              to="/settings/privacy"
            />
            <SettingsRow
              icon={<Scale size={16} />}
              label="Terms of Service"
              to="/settings/terms"
            />
            <SettingsRow
              icon={<AlertTriangle size={16} />}
              label="Disclaimer"
              to="/settings/disclaimer"
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            Actions
          </h2>
          <div className="space-y-1">
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-3 w-full bg-slate-800 rounded-xl p-4 min-h-[48px] active:bg-slate-700 transition-colors text-left"
            >
              <Trash2 size={16} className="text-red-400" />
              <span className="text-sm font-medium text-red-400">
                Reset Progress
              </span>
            </button>
            <button
              onClick={() =>
                openExternal(
                  "mailto:dataforge.app@gmail.com?subject=DataForge%20Feedback"
                )
              }
              className="flex items-center gap-3 w-full bg-slate-800 rounded-xl p-4 min-h-[48px] active:bg-slate-700 transition-colors text-left"
            >
              <Mail size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-white">
                Send Feedback
              </span>
            </button>
            <button
              onClick={() =>
                openExternal(
                  "https://play.google.com/store/apps/details?id=com.forgelabs.dataforge"
                )
              }
              className="flex items-center gap-3 w-full bg-slate-800 rounded-xl p-4 min-h-[48px] active:bg-slate-700 transition-colors text-left"
            >
              <Star size={16} className="text-amber-400" />
              <span className="text-sm font-medium text-white">
                Rate This App
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between bg-slate-800 rounded-xl p-4 min-h-[48px] active:bg-slate-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-500" />
    </Link>
  );
}
