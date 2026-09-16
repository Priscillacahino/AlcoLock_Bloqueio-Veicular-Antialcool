import React from 'react';
import { Power, Lock, CheckCircle2, AlertTriangle, Fingerprint, Sparkles } from 'lucide-react';
import { IgnitionState } from '../types';

interface Props {
  ignitionState: IgnitionState;
  onPressStart: () => void;
  onPressStop: () => void;
  onPressWhenLocked: () => void;
  onPressWhenPendingTest: () => void;
}

export const IgnitionButton: React.FC<Props> = ({
  ignitionState,
  onPressStart,
  onPressStop,
  onPressWhenLocked,
  onPressWhenPendingTest,
}) => {
  const [shaking, setShaking] = React.useState(false);
  const [clickNotice, setClickNotice] = React.useState<string | null>(null);

  const handleClick = () => {
    if (ignitionState === 'LOCKED') {
      setShaking(true);
      setClickNotice('BLOQUEADO! ÁLCOOL DETECTADO NO MOTORISTA');
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setClickNotice(null), 3500);
      onPressWhenLocked();
      return;
    }

    if (ignitionState === 'OFF' || ignitionState === 'TESTING') {
      setClickNotice('FAÇA A LEITURA DA PALMA NO VOLANTE OU NO BOTÃO');
      setTimeout(() => setClickNotice(null), 3000);
      onPressWhenPendingTest();
      return;
    }

    if (ignitionState === 'UNLOCKED_READY') {
      onPressStart();
      return;
    }

    if (ignitionState === 'RUNNING') {
      onPressStop();
      return;
    }
  };

  // Determine button styles based on state
  let ringClasses = 'border-slate-700 shadow-inner text-slate-500 bg-slate-900';
  let label = 'ENGINE START / STOP';
  let subLabel = 'LEITURA PENDENTE';

  if (ignitionState === 'LOCKED') {
    ringClasses = 'border-rose-500 bg-rose-950/60 text-rose-300 shadow-rose-950/80 ring-4 ring-rose-600/40 animate-pulse';
    label = 'IGNIÇÃO BLOQUEADA';
    subLabel = 'MOTORISTA COM ÁLCOOL';
  } else if (ignitionState === 'UNLOCKED_READY') {
    ringClasses = 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-emerald-900/50 ring-4 ring-emerald-500/30 hover:scale-105';
    label = 'START ENGINE';
    subLabel = 'TOQUE PARA LIGAR';
  } else if (ignitionState === 'RUNNING') {
    ringClasses = 'border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-cyan-900/60 ring-4 ring-cyan-400/30';
    label = 'STOP ENGINE';
    subLabel = 'MOTOR LIGADO';
  } else if (ignitionState === 'STARTING') {
    ringClasses = 'border-amber-400 bg-amber-950/60 text-amber-200 animate-spin';
    label = 'PARTIDA...';
    subLabel = 'ARRANQUE';
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2 flex items-center gap-1.5 justify-center">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Controle de Ignição Eletrônica
        </span>
        <span className="px-1.5 py-0.2 rounded text-[8px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
          DADSS TOUCH
        </span>
      </div>

      <div className="relative">
        {/* Outer bezel ring with infrared optical rim */}
        <div className="p-3 rounded-full bg-gradient-to-b from-slate-700 via-slate-900 to-black border-2 border-slate-700/80 shadow-2xl">
          {/* Main push button with integrated optical sensor glass */}
          <button
            id="btn-engine-ignition"
            type="button"
            onClick={handleClick}
            disabled={ignitionState === 'STARTING'}
            className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-200 select-none ${ringClasses} ${
              shaking ? 'animate-[bounce_0.2s_ease-in-out_2]' : ''
            }`}
          >
            {ignitionState === 'LOCKED' ? (
              <Lock className="w-8 h-8 text-rose-400 mb-1" />
            ) : ignitionState === 'UNLOCKED_READY' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1 animate-bounce" />
            ) : ignitionState === 'RUNNING' ? (
              <Power className="w-8 h-8 text-cyan-300 mb-1" />
            ) : (
              <Fingerprint className="w-8 h-8 text-cyan-400 mb-1" />
            )}

            <span className="font-black text-xs tracking-wider uppercase leading-tight">
              {label}
            </span>
            <span className="text-[9px] font-mono tracking-tighter opacity-80 mt-1">
              {subLabel}
            </span>
          </button>
        </div>

        {/* Warning Badge when Locked */}
        {ignitionState === 'LOCKED' && (
          <div className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1.5 shadow-lg animate-ping">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Sensor description */}
      <div className="mt-2 text-center">
        <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Superfície de toque com leitura óptica espectroscópica integrada
        </span>
      </div>

      {/* Ephemeral Notice on click */}
      {clickNotice && (
        <div className="mt-3 px-3 py-1.5 rounded bg-rose-950/90 border border-rose-600 text-rose-200 text-xs font-semibold text-center max-w-xs shadow-lg animate-in fade-in duration-200 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{clickNotice}</span>
        </div>
      )}
    </div>
  );
};
