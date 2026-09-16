import React from 'react';
import { ShieldCheck, ShieldAlert, Volume2, VolumeX, Car, Activity, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { IgnitionState } from '../types';

interface Props {
  ignitionState: IgnitionState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLogs: () => void;
  onOpenEmergency: () => void;
  driverName: string;
  trustedDriverName?: string;
  onOpenRegisterTrustedDriver?: () => void;
}

export const DashboardHeader: React.FC<Props> = ({
  ignitionState,
  soundEnabled,
  onToggleSound,
  onOpenLogs,
  onOpenEmergency,
  driverName,
  trustedDriverName,
  onOpenRegisterTrustedDriver,
}) => {
  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 select-none">
      {/* Brand & System Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 shadow-inner">
          <Car className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wider text-slate-100 uppercase text-xs">AlcoLock Pro</span>
          <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
            v3.8 CAN-BUS
          </span>
        </div>

        {/* Current Ignition Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          {ignitionState === 'LOCKED' ? (
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              BLOQUEIO ATIVO
            </span>
          ) : ignitionState === 'RUNNING' ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              MOTOR EM MARCHA
            </span>
          ) : ignitionState === 'UNLOCKED_READY' ? (
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              PARTIDA AUTORIZADA
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Activity className="w-3.5 h-3.5" />
              TESTE REQUERIDO
            </span>
          )}
        </div>
      </div>

      {/* Middle Banner: Law & Safety protocol */}
      <div className="hidden md:flex items-center gap-2 text-slate-400 text-[11px]">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Tolerância Zero (Lei Seca): <strong>0,00 mg/L</strong></span>
        <span className="text-slate-600">|</span>
        <span>Condutor: <strong className="text-slate-200">{driverName}</strong></span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Trusted Alternative Driver Config Button */}
        {onOpenRegisterTrustedDriver && (
          <button
            id="btn-header-trusted-driver"
            type="button"
            onClick={onOpenRegisterTrustedDriver}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/80 text-emerald-300 hover:text-emerald-200 transition cursor-pointer font-medium text-xs"
            title="Gerenciar motorista de confiança cadastrado"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              Motorista Alternativo: <strong className="text-white">{trustedDriverName || 'Cadastrar'}</strong>
            </span>
          </button>
        )}

        {/* Clock */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time || '12:00:00'}</span>
        </div>

        {/* Sound toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Desativar áudio automotivo' : 'Ativar áudio automotivo'}
          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Audit Log / Black Box */}
        <button
          id="btn-open-telemetry-logs"
          type="button"
          onClick={onOpenLogs}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer font-medium text-xs"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Telemetria</span>
        </button>

        {/* Emergency Assistance Button */}
        {ignitionState === 'LOCKED' && (
          <button
            id="btn-emergency-help"
            type="button"
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/80 font-semibold text-xs animate-pulse cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Carona</span>
          </button>
        )}
      </div>
    </header>
  );
};
