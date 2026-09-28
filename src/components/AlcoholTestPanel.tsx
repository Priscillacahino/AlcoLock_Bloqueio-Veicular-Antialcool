import React from 'react';
import { Wind, Fingerprint, Camera, ShieldCheck, ShieldAlert, Sparkles, Activity, AlertOctagon, UserCheck, BellRing, Settings2, Sliders, Hand, Waves } from 'lucide-react';
import { IgnitionState, TrustedAlternativeDriver, DetectionMethod, ValidationStatus } from '../types';

interface Props {
  ignitionState: IgnitionState;
  onExecuteTest: (targetBAC: number) => void;
  isTesting: boolean;
  testProgress: number; // 0 to 100
  lastBAC: number | null;
  trustedDriver: TrustedAlternativeDriver;
  onOpenRegisterTrustedDriver: () => void;
  onOpenAlertModal: () => void;
  safeThreshold: number;
  onSetSafeThreshold: (val: number) => void;
  selectedMethod: DetectionMethod;
  onSelectMethod: (method: DetectionMethod) => void;
  validationStatus: ValidationStatus;
  onSimulateNonConclusive: (status: 'INCONCLUSIVE' | 'SENSOR_UNAVAILABLE') => void;
}

export const AlcoholTestPanel: React.FC<Props> = ({
  ignitionState,
  onExecuteTest,
  isTesting,
  testProgress,
  lastBAC,
  trustedDriver,
  onOpenRegisterTrustedDriver,
  onOpenAlertModal,
  safeThreshold,
  onSetSafeThreshold,
  selectedMethod,
  onSelectMethod,
  validationStatus,
  onSimulateNonConclusive,
}) => {
  const [selectedPreset, setSelectedPreset] = React.useState<number>(0.28);
  const [customBAC, setCustomBAC] = React.useState<number>(0.28);
  const [useRealCamera, setUseRealCamera] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Toggle optional live webcam for Driver Monitoring Camera (DMS)
  const toggleCamera = async () => {
    if (useRealCamera) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setUseRealCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setUseRealCamera(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }, 100);
      } catch {
        alert('Câmera não autorizada ou não disponível. O sistema utilizará a simulação biométrica facial de alta precisão.');
        setUseRealCamera(false);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const isAlcoholDetected = lastBAC !== null && lastBAC > safeThreshold;

  return (
    <div className="w-full rounded-xl bg-slate-900/80 border border-slate-800 p-4 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400">
            {selectedMethod === 'TOUCH_PALM_STEERING' ? (
              <Hand className="w-4 h-4" />
            ) : selectedMethod === 'TOUCH_START_BUTTON' ? (
              <Fingerprint className="w-4 h-4" />
            ) : (
              <Wind className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sensor de Detecção de Álcool no Cockpit
            </h4>
            <span className="text-[10px] text-slate-400">
              {selectedMethod === 'TOUCH_PALM_STEERING'
                ? 'Simulação de leitura óptica por toque — referência de pesquisa'
                : selectedMethod === 'TOUCH_START_BUTTON'
                ? 'Simulação de leitura óptica no botão Start/Stop'
                : 'Sensor Eletroquímico de Ar Alveolar (Bafômetro)'}
            </span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          CONCEITO / SIMULAÇÃO
        </span>
      </div>

      {/* Detection Technology Selector Tabs */}
      <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 gap-1 text-center text-xs">
        <button
          type="button"
          onClick={() => onSelectMethod('TOUCH_PALM_STEERING')}
          className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedMethod === 'TOUCH_PALM_STEERING'
              ? 'bg-cyan-900/70 border border-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Hand className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Volante (Palma)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('TOUCH_START_BUTTON')}
          className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedMethod === 'TOUCH_START_BUTTON'
              ? 'bg-cyan-900/70 border border-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Botão Start</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('BREATHALYZER')}
          className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedMethod === 'BREATHALYZER'
              ? 'bg-cyan-900/70 border border-cyan-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Bafômetro (Sopro)</span>
        </button>
      </div>

      {/* Safe Threshold Selector */}
      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Limite configurado da simulação:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSetSafeThreshold(0.00)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
              safeThreshold === 0.00
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            0.00 (cenário base)
          </button>
          <button
            type="button"
            onClick={() => onSetSafeThreshold(0.04)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
              safeThreshold === 0.04
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            0.04 (cenário alternativo)
          </button>
        </div>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="text-slate-400">Resultado da validação:</span>
          <span className="font-mono font-bold text-slate-200">{validationStatus}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSimulateNonConclusive('INCONCLUSIVE')}
            disabled={ignitionState === 'RUNNING'}
            className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 cursor-pointer"
          >
            Simular resultado inconclusivo
          </button>
          <button
            type="button"
            onClick={() => onSimulateNonConclusive('SENSOR_UNAVAILABLE')}
            disabled={ignitionState === 'RUNNING'}
            className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 cursor-pointer"
          >
            Simular sensor indisponível
          </button>
        </div>
      </div>
      {/* Prominent Alcohol Detection Banner with Suggestion for Alternative Driver */}
      {isAlcoholDetected && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/90 to-slate-950 border border-red-600/80 space-y-2.5 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-900/60 text-red-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-red-200 uppercase tracking-wide">
                Veículo Impossibilitado de Dar Partida
              </h5>
              <p className="text-[11px] text-red-300/90 leading-relaxed">
                Leitura simulada acima do limite configurado ({lastBAC.toFixed(2)} {selectedMethod === 'BREATHALYZER' ? 'mg/L (simulado)' : 'índice simulado'}). A partida permanece bloqueada na demonstração. O resultado não representa diagnóstico clínico, prova legal ou medição homologada.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              id="btn-alert-call-trusted"
              type="button"
              onClick={onOpenAlertModal}
              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Notificar Motorista Alternativo ({trustedDriver.name.split(' ')[0]})</span>
            </button>
            <button
              id="btn-edit-trusted-driver-panel"
              type="button"
              onClick={onOpenRegisterTrustedDriver}
              className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Configurar motorista confiável cadastrado"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sensor Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {selectedMethod === 'TOUCH_PALM_STEERING' ? (
          <>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Hand className="w-4 h-4 -scale-x-100" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Palma Esquerda</div>
                <div className="text-[10px] text-slate-400">Emissor óptico conceitual</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Hand className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Palma Direita</div>
                <div className="text-[10px] text-slate-400">Fotodetector conceitual</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Dupla Validação</div>
                <div className="text-[10px] text-emerald-400">Banco + Palma ativos</div>
              </div>
            </div>
          </>
        ) : selectedMethod === 'TOUCH_START_BUTTON' ? (
          <>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Botão Start/Stop</div>
                <div className="text-[10px] text-slate-400">Sensor óptico conceitual</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Fluxo Capilar</div>
                <div className="text-[10px] text-slate-400">Detecção de Tecido Vivo</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-purple-950/60 border border-purple-800/60 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Dupla Validação</div>
                <div className="text-[10px] text-purple-300">Banco + Dedo no Start</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Wind className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Sensor de Sopro</div>
                <div className="text-[10px] text-slate-400">Coluna do volante</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-200">Sensor Dérmico</div>
                <div className="text-[10px] text-slate-400">Apoio de mão</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-purple-950/60 border border-purple-800/60 text-purple-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-slate-200">Câmera DMS</div>
                  <div className="text-[10px] text-slate-400">Rastreio facial</div>
                </div>
              </div>
              <button
                id="btn-toggle-camera-feed"
                type="button"
                onClick={toggleCamera}
                className="text-[9px] px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer border border-slate-700"
              >
                {useRealCamera ? 'Desativar' : 'Webcam'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Video stream box if webcam enabled */}
      {useRealCamera && selectedMethod === 'BREATHALYZER' && (
        <div className="relative rounded-lg overflow-hidden border border-purple-500/50 max-h-36 flex items-center justify-center bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-36 object-cover" />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-purple-300 text-[10px] font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            DMS: Rastreando Face e Olhos do Condutor
          </div>
        </div>
      )}

      {/* Active Scan / Test Progress Display when Testing */}
      {isTesting ? (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/60 space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-300 flex items-center gap-2">
              {selectedMethod === 'TOUCH_PALM_STEERING' ? (
                <>
                  <Hand className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Simulação óptica: processando leitura de contato...
                </>
              ) : selectedMethod === 'TOUCH_START_BUTTON' ? (
                <>
                  <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Sensor de toque: processando leitura simulada...
                </>
              ) : (
                <>
                  <Wind className="w-4 h-4 text-cyan-400 animate-spin" />
                  Medindo Teor de Álcool no Ar Alveolar...
                </>
              )}
            </span>
            <span className="font-mono font-bold text-cyan-400">{testProgress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-150"
              style={{ width: `${testProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {selectedMethod === 'TOUCH_PALM_STEERING'
                ? 'Emissor óptico conceitual ativo'
                : selectedMethod === 'TOUCH_START_BUTTON'
                ? 'Sensor de toque: verificando contato'
                : 'Pressão do fluxo de ar: Adequada'}
            </span>
            <span>
              {selectedMethod === 'BREATHALYZER'
                ? 'Sensor AlcoLock: Calculando mg/L'
                : 'Simulação por toque: calculando índice'}
            </span>
          </div>
        </div>
      ) : (
        /* Test triggers & scenarios */
        <div className="space-y-3">
          <div className="text-[11px] text-slate-400 font-medium">
            Selecione uma simulação para testar o sistema no cockpit:
          </div>

          {/* Quick Scenario Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Scenario 1: Clean/Sober (0.00) */}
            <button
              id="btn-test-scenario-sober"
              type="button"
              onClick={() => {
                setSelectedPreset(0.00);
                onExecuteTest(0.00);
              }}
              disabled={ignitionState === 'RUNNING'}
              className="p-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/60 text-left transition cursor-pointer flex items-start gap-2.5 group"
            >
              <div className="p-1.5 rounded bg-emerald-900/60 text-emerald-300 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-200 group-hover:text-emerald-100">
                  Cenário aprovado (0,00 {selectedMethod === 'BREATHALYZER' ? 'mg/L simulado' : 'índice'})
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">
                  {selectedMethod === 'TOUCH_PALM_STEERING'
                    ? 'Leitura simulada dentro do limite configurado. Libera a partida na demonstração.'
                    : 'Leitura simulada dentro do limite. Libera a ignição na demonstração.'}
                </div>
              </div>
            </button>

            {/* Scenario 2: Drank alcohol / Lei Seca (0.28) */}
            <button
              id="btn-test-scenario-alcohol"
              type="button"
              onClick={() => {
                setSelectedPreset(0.28);
                onExecuteTest(0.28);
              }}
              disabled={ignitionState === 'RUNNING'}
              className="p-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/60 text-left transition cursor-pointer flex items-start gap-2.5 group"
            >
              <div className="p-1.5 rounded bg-rose-900/60 text-rose-300 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-200 group-hover:text-rose-100">
                  Cenário acima do limite (0,28 {selectedMethod === 'BREATHALYZER' ? 'mg/L simulado' : 'índice'})
                </div>
                <div className="text-[10px] text-rose-300/80 mt-0.5">
                  Leitura simulada acima do limite. Bloqueia a partida e sugere substituto.
                </div>
              </div>
            </button>
          </div>

          {/* Advanced / Custom Level Slider */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Nível de Álcool Personalizado:</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                customBAC === 0
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : customBAC >= 0.34
                  ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {customBAC.toFixed(2)} {selectedMethod === 'BREATHALYZER' ? 'mg/L' : 'g/L'} {customBAC === 0 ? '(Aprovado)' : '(Acima do limite configurado)'}
              </span>
            </div>

            <input
              id="slider-custom-bac"
              type="range"
              min="0.00"
              max="1.00"
              step="0.02"
              value={customBAC}
              onChange={(e) => setCustomBAC(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.00 (cenário base)</span>
              <span>0.04 (cenário alternativo)</span>
              <span>0.34 (exemplo de teste)</span>
              <span>1.00 (máximo da simulação)</span>
            </div>

            <button
              id="btn-execute-custom-test"
              type="button"
              onClick={() => onExecuteTest(customBAC)}
              disabled={ignitionState === 'RUNNING'}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition cursor-pointer border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executar Leitura ({selectedMethod === 'TOUCH_PALM_STEERING' ? 'Palma' : selectedMethod === 'TOUCH_START_BUTTON' ? 'Toque Start' : 'Bafômetro'}) com {customBAC.toFixed(2)} {selectedMethod === 'BREATHALYZER' ? 'mg/L' : 'g/L'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Result feedback */}
      {lastBAC !== null && !isTesting && (
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
          lastBAC <= safeThreshold
            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
            : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {lastBAC <= safeThreshold ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            )}
            <div>
              <div className="font-bold">
                Última leitura: {lastBAC.toFixed(2)} {selectedMethod === 'BREATHALYZER' ? 'mg/L (simulado)' : 'índice simulado'} (limite do cenário: {safeThreshold.toFixed(2)})
              </div>
              <div className="text-[11px] opacity-80">
                {lastBAC <= safeThreshold
                  ? 'Validação simulada aprovada para o cenário selecionado.'
                  : 'Validação simulada não aprovada. Partida bloqueada até nova validação.'}
              </div>
            </div>
          </div>
          <span className="font-mono font-bold text-[11px] uppercase px-2 py-1 rounded bg-black/40">
            {lastBAC <= safeThreshold ? 'APROVADO' : 'REPROVADO'}
          </span>
        </div>
      )}

      {/* Registered Alternative Driver Info Tile */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <span>Motorista Alternativo: {trustedDriver.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-normal">
                {trustedDriver.relationship}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Pareamento: {trustedDriver.pairedDeviceName} • PIN protegido
            </div>
          </div>
        </div>
        <button
          id="btn-edit-trusted-driver-footer"
          type="button"
          onClick={onOpenRegisterTrustedDriver}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold border border-slate-700 transition cursor-pointer"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

