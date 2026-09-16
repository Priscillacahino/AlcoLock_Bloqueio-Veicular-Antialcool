import React from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, UserX, UserCheck, Flame, Gauge, BatteryCharging } from 'lucide-react';
import { IgnitionState, VehicleTelemetry } from '../types';

interface Props {
  ignitionState: IgnitionState;
  telemetry: VehicleTelemetry;
  lastBAC: number | null;
  driverName: string;
  onOpenDriverReplacement: () => void;
  onTriggerTest: () => void;
}

export const InstrumentCluster: React.FC<Props> = ({
  ignitionState,
  telemetry,
  lastBAC,
  driverName,
  onOpenDriverReplacement,
  onTriggerTest,
}) => {
  const isRunning = ignitionState === 'RUNNING';
  const isLocked = ignitionState === 'LOCKED';
  const isReady = ignitionState === 'UNLOCKED_READY';
  const isTesting = ignitionState === 'TESTING';

  // Calculate tachometer percentage for visual dial (0 to 7000 RPM)
  const rpmPercent = Math.min(100, Math.max(0, (telemetry.rpm / 7000) * 100));
  const speedPercent = Math.min(100, Math.max(0, (telemetry.speedKmh / 240) * 100));

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-5 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Subtle cockpit carbon fiber / grid styling */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* Top status bar of the instrument cluster (Telltale tell-tales) */}
      <div className="relative flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded font-bold ${isRunning ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-500'}`}>
            GEAR: {telemetry.gear}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            {telemetry.batteryVolts.toFixed(1)}V
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {telemetry.coolantTempC}°C
          </span>
        </div>

        {/* Security & Interlock Tell-Tale Status */}
        <div className="flex items-center gap-2">
          {isLocked && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse font-sans font-bold text-xs">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>IMOBILIZADOR ATIVADO</span>
            </div>
          )}
          {isReady && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-sans font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SÓBRIO: PARTIDA PRONTA</span>
            </div>
          )}
          <span className="text-slate-400 font-sans">Combustível: {telemetry.fuelPercent}%</span>
        </div>
      </div>

      {/* Main 3-Section Digital Cockpit: RPM (Left) | Central Information Display (Center) | Speedometer (Right) */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* LEFT GAUGE: Tachometer (RPM) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circular arc */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * rpmPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-300 ${
                  isRunning ? 'text-cyan-400 shadow-cyan-500' : 'text-slate-600'
                }`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {telemetry.rpm}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                RPM × 1000
              </span>
            </div>
          </div>
          <div className="w-full mt-2 flex justify-between text-[10px] font-mono text-slate-500 px-2">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span className="text-rose-400">7 REDLINE</span>
          </div>
        </div>

        {/* CENTER SECTION: Dynamic Automotive Interlock Screen */}
        <div className="lg:col-span-6 flex flex-col items-center text-center p-5 rounded-xl bg-slate-950/90 border border-slate-800 min-h-[220px] justify-center relative overflow-hidden">
          {/* Background alert glow */}
          {isLocked && (
            <div className="absolute inset-0 bg-rose-950/30 border-2 border-rose-600/60 rounded-xl pointer-events-none animate-pulse" />
          )}
          {isReady && (
            <div className="absolute inset-0 bg-emerald-950/20 border-2 border-emerald-500/40 rounded-xl pointer-events-none" />
          )}

          {/* SCREEN CONTENT BASED ON IGNITION STATE */}
          {isLocked ? (
            <div className="flex flex-col items-center space-y-3 z-10 max-w-md">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 animate-bounce">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-rose-400 text-lg font-black tracking-wide uppercase">
                  BLOQUEIO DE PARTIDA ATIVADO
                </h3>
                <p className="text-xs text-rose-200 mt-1 font-medium">
                  Álcool detectado no condutor do assento ({lastBAC ? `${lastBAC.toFixed(2)} mg/L` : 'Teor Positivo'}).
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-600/80 text-rose-100 text-xs font-semibold">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-300" />
                  Veículo Imobilizado: Tolerância 0,00 mg/L violada
                </div>
              </div>

              {/* Strict Requirement Notice: Must Replace Driver */}
              <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 text-left space-y-1.5 w-full shadow-inner">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <UserX className="w-4 h-4 text-amber-400" />
                  <span>Condição Obrigatória de Desbloqueio:</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  O motorista atual <strong>({driverName})</strong> está impedido de conduzir. O veículo permanecerá bloqueado até que <strong>seja substituído por outro condutor sóbrio</strong> (0,00 mg/L).
                </p>
              </div>

              {/* Action Button: Replace Driver */}
              <button
                id="btn-replace-driver-trigger"
                type="button"
                onClick={onOpenDriverReplacement}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-900/30 border border-cyan-400/40 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span>Substituir Motorista (Troca de Condutor)</span>
              </button>
            </div>
          ) : isReady ? (
            <div className="flex flex-col items-center space-y-3 z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-emerald-400 text-lg font-black tracking-wide uppercase">
                  CONDUTOR APROVADO: 0,00 mg/L
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Motorista <strong>{driverName}</strong> verificado com sucesso. Sem traços de álcool.
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-600/50 text-emerald-200 text-xs font-medium">
                Pressione o botão <strong>START ENGINE</strong> no console para ligar o motor.
              </div>
            </div>
          ) : isTesting ? (
            <div className="flex flex-col items-center space-y-3 z-10">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                <Gauge className="w-5 h-5 text-cyan-400 absolute" />
              </div>
              <div>
                <h3 className="text-cyan-400 text-base font-bold uppercase tracking-wider">
                  ANALISANDO AMOSTRA ALVEOLAR...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sopre continuamente na direção do volante por 3 segundos.
                </p>
              </div>
              <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div className="bg-cyan-400 h-full w-full animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : isRunning ? (
            <div className="flex flex-col items-center space-y-2 z-10">
              <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-white text-base font-bold tracking-wide">
                VEÍCULO EM OPERAÇÃO
              </h3>
              <p className="text-xs text-slate-400">
                Condutor: <span className="text-emerald-400 font-semibold">{driverName}</span> (Sóbrio - 0,00 mg/L)
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs">
                  Modo: Comfort Drive
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs">
                  Monitoramento Ativo
                </span>
              </div>
            </div>
          ) : (
            // OFF / WAITING TEST
            <div className="flex flex-col items-center space-y-3 z-10">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-amber-400 text-base font-bold uppercase tracking-wide">
                  TESTE DE ÁLCOOL REQUERIDO
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  O veículo exige confirmação de sobriedade no banco do motorista antes de desbloquear o motor de arranque.
                </p>
              </div>
              <button
                id="btn-start-test-cluster"
                type="button"
                onClick={onTriggerTest}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wider uppercase transition cursor-pointer shadow-md"
              >
                Iniciar Teste de Ar Alveolar
              </button>
            </div>
          )}
        </div>

        {/* RIGHT GAUGE: Speedometer */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * speedPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-300 ${
                  isRunning ? 'text-emerald-400 shadow-emerald-500' : 'text-slate-600'
                }`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {telemetry.speedKmh}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                KM/H
              </span>
            </div>
          </div>
          <div className="w-full mt-2 flex justify-between text-[10px] font-mono text-slate-500 px-2">
            <span>0</span>
            <span>80</span>
            <span>160</span>
            <span>240</span>
          </div>
        </div>
      </div>
    </div>
  );
};
