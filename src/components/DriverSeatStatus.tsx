import React from 'react';
import { User, ShieldAlert, ShieldCheck, UserCheck, RefreshCw, AlertCircle, BellRing } from 'lucide-react';
import { DriverProfile, IgnitionState, SeatSensors, TrustedAlternativeDriver } from '../types';

interface Props {
  currentDriver: DriverProfile;
  ignitionState: IgnitionState;
  seatSensors: SeatSensors;
  onOpenDriverReplacement: () => void;
  onToggleSeatbelt: () => void;
  trustedDriver?: TrustedAlternativeDriver;
  onOpenAlertModal?: () => void;
  onOpenRegisterTrustedDriver?: () => void;
}

export const DriverSeatStatus: React.FC<Props> = ({
  currentDriver,
  ignitionState,
  seatSensors,
  onOpenDriverReplacement,
  onToggleSeatbelt,
  trustedDriver,
  onOpenAlertModal,
  onOpenRegisterTrustedDriver,
}) => {
  const isLocked = ignitionState === 'LOCKED';
  const isSober = currentDriver.lastTestBAC === 0;

  return (
    <div className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Banco do Motorista (Sensor de Presença)
            </h4>
            <span className="text-[10px] text-slate-400">
              Assento Dianteiro Esquerdo • Telemetria CAN
            </span>
          </div>
        </div>

        {/* Seat occupancy badge */}
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          OCUPADO (72 kg)
        </span>
      </div>

      {/* Driver Card Info */}
      <div className={`p-3 rounded-lg border transition-all ${
        isLocked
          ? 'bg-rose-950/30 border-rose-800/80 shadow-rose-950/20'
          : isSober
          ? 'bg-emerald-950/20 border-emerald-800/60'
          : 'bg-slate-950/60 border-slate-800'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
              isLocked
                ? 'bg-rose-900/50 border-rose-500 text-rose-200'
                : isSober
                ? 'bg-emerald-900/50 border-emerald-500 text-emerald-200'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              {currentDriver.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-100 text-sm">{currentDriver.name}</span>
                {currentDriver.role === 'condutor_substituto' && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded uppercase font-semibold">
                    Substituto
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                CNH: {currentDriver.cnh}
              </span>
            </div>
          </div>

          {/* Test status pill */}
          <div>
            {isLocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-500/20 border border-rose-500/50 text-rose-300 text-[10px] font-bold">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                ÁLCOOL: {currentDriver.lastTestBAC?.toFixed(2)} mg/L
              </span>
            ) : isSober ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SÓBRIO: 0,00 mg/L
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-bold">
                TESTE PENDENTE
              </span>
            )}
          </div>
        </div>

        {/* Diagnostic alert if locked */}
        {isLocked && (
          <div className="mt-3 p-2 rounded bg-rose-900/30 border border-rose-700/60 text-[11px] text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-300">Motorista Inapto para Dirigir:</strong> O sensor acusou ingestão alcoólica acima do permitido. O sistema desarmou o motor de arranque e registrou o evento na caixa-preta veicular.
            </div>
          </div>
        )}
      </div>

      {/* Seatbelt and in-cabin sensor controls */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          id="btn-toggle-seatbelt"
          type="button"
          onClick={onToggleSeatbelt}
          className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
            seatSensors.seatbeltFastened
              ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
              : 'bg-slate-900 border-amber-800/60 text-amber-300'
          }`}
        >
          <span className="text-[11px]">Cinto do Motorista:</span>
          <span className="font-bold text-[10px] uppercase font-mono">
            {seatSensors.seatbeltFastened ? 'Afivelado' : 'Solto'}
          </span>
        </button>

        <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-between">
          <span className="text-[11px]">Sensor Volante:</span>
          <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono">
            Ativo (IR Óptico)
          </span>
        </div>
      </div>

      {/* REPLACEMENT & TRUSTED DRIVER TRIGGER BUTTONS */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        {isLocked && trustedDriver && onOpenAlertModal ? (
          <button
            id="btn-seat-notify-trusted-driver"
            type="button"
            onClick={onOpenAlertModal}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-950/50"
          >
            <BellRing className="w-4 h-4" />
            <span>Notificar Motorista Alternativo ({trustedDriver.name.split(' ')[0]})</span>
          </button>
        ) : null}

        <button
          id="btn-open-driver-replacement-modal"
          type="button"
          onClick={onOpenDriverReplacement}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md ${
            isLocked
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Substituir Condutor no Assento</span>
        </button>
        <p className="text-[10px] text-center text-slate-500">
          O novo motorista passará por teste obrigatório de sobriedade e confirmação no banco.
        </p>
      </div>
    </div>
  );
};
