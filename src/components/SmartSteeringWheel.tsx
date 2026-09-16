import React from 'react';
import { Hand, Waves, Activity, ShieldCheck, ShieldAlert, Cpu, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import { IgnitionState, SeatSensors, DetectionMethod } from '../types';

interface Props {
  ignitionState: IgnitionState;
  seatSensors: SeatSensors;
  onExecutePalmTest: (simulatedBAC: number) => void;
  isScanning: boolean;
  scanProgress: number;
  lastReading: number | null;
  selectedMethod: DetectionMethod;
  onSelectMethod: (method: DetectionMethod) => void;
}

export const SmartSteeringWheel: React.FC<Props> = ({
  ignitionState,
  seatSensors,
  onExecutePalmTest,
  isScanning,
  scanProgress,
  lastReading,
  selectedMethod,
  onSelectMethod,
}) => {
  const [handsPlaced, setHandsPlaced] = React.useState(true);
  const [simulatedAlcohol, setSimulatedAlcohol] = React.useState<number>(0.00);
  const isLocked = ignitionState === 'LOCKED';
  const isSober = lastReading !== null && lastReading === 0;

  const handleStartPalmScan = (bacToTest: number) => {
    setSimulatedAlcohol(bacToTest);
    setHandsPlaced(true);
    onExecutePalmTest(bacToTest);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-wide text-white uppercase">
                Volante Inteligente • Sensor Óptico DADSS
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                Infravermelho NIR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Espectroscopia óptica da palma da mão: mede o álcool nos capilares sem soprar
            </p>
          </div>
        </div>

        {/* Dual Validation Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">Dupla Validação:</span>
          <span className="text-emerald-400 font-mono font-bold">Banco + Palma da Mão</span>
        </div>
      </div>

      {/* Steering Wheel Visual Graphic Stage */}
      <div className="relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden min-h-[260px]">
        {/* Ambient IR Glow Background */}
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isScanning
            ? 'opacity-40 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0,transparent_70%)]'
            : isLocked
            ? 'opacity-40 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.25)_0,transparent_70%)]'
            : 'opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)]'
        }`} />

        {/* SVG Steering Wheel with Touch Zones */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Wheel Outer Rim */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Base outer circle */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="#1e293b"
              strokeWidth="18"
              className="drop-shadow-lg"
            />

            {/* Inner leather stitching accent */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
            />

            {/* Left Palm Optical Touch Zone (DADSS NIR) */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke={
                isScanning
                  ? '#06b6d4'
                  : isLocked
                  ? '#f43f5e'
                  : handsPlaced
                  ? '#10b981'
                  : '#334155'
              }
              strokeWidth="18"
              strokeDasharray="45 220"
              strokeDashoffset="35"
              className={`transition-colors duration-300 ${isScanning ? 'animate-pulse' : ''}`}
            />

            {/* Right Palm Optical Touch Zone (DADSS NIR) */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke={
                isScanning
                  ? '#06b6d4'
                  : isLocked
                  ? '#f43f5e'
                  : handsPlaced
                  ? '#10b981'
                  : '#334155'
              }
              strokeWidth="18"
              strokeDasharray="45 220"
              strokeDashoffset="-95"
              className={`transition-colors duration-300 ${isScanning ? 'animate-pulse' : ''}`}
            />

            {/* Spokes of Steering Wheel */}
            <line x1="100" y1="100" x2="35" y2="70" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
            <line x1="100" y1="100" x2="35" y2="130" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
            <line x1="100" y1="100" x2="165" y2="100" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
          </svg>

          {/* Center Hub & Airbag Badge */}
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700 flex flex-col items-center justify-center p-2 text-center shadow-inner z-10">
            <Cpu className={`w-5 h-5 mb-0.5 ${
              isScanning
                ? 'text-cyan-400 animate-spin'
                : isLocked
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`} />
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-300">
              DADSS
            </span>
            <span className="text-[8px] text-slate-400 font-mono">
              NIR 1450nm
            </span>
          </div>

          {/* Left Palm Sensor Indicator Overlay */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className={`p-2 rounded-full border shadow-lg transition-all ${
              handsPlaced
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-cyan-950 scale-110'
                : 'bg-slate-900/90 border-slate-700 text-slate-500'
            }`}>
              <Hand className="w-5 h-5 -scale-x-100" />
            </div>
            <span className="text-[9px] font-bold text-slate-300 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
              Palma Esq.
            </span>
          </div>

          {/* Right Palm Sensor Indicator Overlay */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className={`p-2 rounded-full border shadow-lg transition-all ${
              handsPlaced
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-cyan-950 scale-110'
                : 'bg-slate-900/90 border-slate-700 text-slate-500'
            }`}>
              <Hand className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold text-slate-300 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
              Palma Dir.
            </span>
          </div>

          {/* Scanning Overlay Rings */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 rounded-full border-2 border-cyan-400/40 animate-ping" />
              <div className="w-40 h-40 rounded-full border-2 border-cyan-400/60 animate-pulse" />
            </div>
          )}
        </div>

        {/* Live Status Bar under steering wheel */}
        <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Espectro NIR:</span>
            <span className="font-mono font-bold text-cyan-400 text-xs">1.450 nm & 1.680 nm</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Fluxo Capilar (Pulso):</span>
            <span className="font-mono font-bold text-emerald-400 text-xs flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              74 BPM (Tecido Vivo)
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Status da Leitura:</span>
            <span className={`font-bold text-xs ${
              isScanning
                ? 'text-cyan-400 animate-pulse'
                : isLocked
                ? 'text-rose-400 font-mono'
                : isSober
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}>
              {isScanning
                ? `Analisando tecidos (${scanProgress}%)...`
                : isLocked
                ? `Álcool: ${lastReading?.toFixed(2)} g/L`
                : isSober
                ? 'Sóbrio: 0,00 g/L'
                : 'Aguardando toque'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Scan Triggers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            Simular Contato da Palma no Volante:
          </span>
          <span className="text-[11px] text-slate-400">
            Tempo de resposta: ~2,5 segundos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            id="btn-scan-palm-sober"
            type="button"
            disabled={isScanning || ignitionState === 'RUNNING'}
            onClick={() => handleStartPalmScan(0.00)}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-emerald-900/60 hover:from-emerald-900 hover:to-emerald-800/80 border border-emerald-600/70 text-emerald-100 flex items-center justify-between gap-2 transition cursor-pointer disabled:opacity-50 shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-800/60 text-emerald-300 group-hover:scale-105 transition">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-white">Palma Sóbria (0,00 g/L)</div>
                <div className="text-[10px] text-emerald-300/80">Sem álcool detectado nos capilares</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              LIBERAR
            </span>
          </button>

          <button
            id="btn-scan-palm-alcohol"
            type="button"
            disabled={isScanning || ignitionState === 'RUNNING'}
            onClick={() => handleStartPalmScan(0.35)}
            className="p-3 rounded-xl bg-gradient-to-r from-rose-950 to-rose-900/60 hover:from-rose-900 hover:to-rose-800/80 border border-rose-600/70 text-rose-100 flex items-center justify-between gap-2 transition cursor-pointer disabled:opacity-50 shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-800/60 text-rose-300 group-hover:scale-105 transition">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-white">Palma com Álcool (0,35 g/L)</div>
                <div className="text-[10px] text-rose-300/80">Simular ingestão alcoólica & bloqueio</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
              BLOQUEAR
            </span>
          </button>
        </div>

        {/* Informative footer explaining the technology */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Como funciona a Leitura Óptica pela Palma da Mão (DADSS):</span>
          </div>
          <p className="leading-relaxed">
            Feixes de luz infravermelha próxima (NIR) penetram as camadas superficiais da derme da palma. O etanol presente no sangue dos capilares absorve comprimentos de onda específicos. A luz refletida é captada por fotodetectores para calcular a taxa de álcool instantaneamente, sem necessidade de sopro ativo.
          </p>
        </div>
      </div>
    </div>
  );
};
