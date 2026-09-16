import React from 'react';
import { X, UserPlus, UserCheck, ShieldAlert, ShieldCheck, Wind, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DriverProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDriver: DriverProfile;
  onConfirmReplacement: (newDriver: DriverProfile) => void;
}

const PRESET_REPLACEMENT_DRIVERS: Array<{ name: string; cnh: string; defaultBAC: number; label: string }> = [
  {
    name: 'Mariana Silva',
    cnh: '98471204938',
    defaultBAC: 0.00,
    label: 'Amiga da Rodada (100% Sóbria - Não bebeu)',
  },
  {
    name: 'Lucas Oliveira',
    cnh: '73920194821',
    defaultBAC: 0.00,
    label: 'Motorista Familiar Habilitado (Sóbrio)',
  },
  {
    name: 'Condutor Teste que Bebeu',
    cnh: '12849204958',
    defaultBAC: 0.35,
    label: 'Simular Substituto Também com Álcool (Teste de Falha)',
  },
];

export const DriverReplacementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDriver,
  onConfirmReplacement,
}) => {
  const [step, setStep] = React.useState<'SELECT' | 'TEST' | 'RESULT'>('SELECT');
  const [selectedDriverName, setSelectedDriverName] = React.useState('Mariana Silva');
  const [selectedDriverCNH, setSelectedDriverCNH] = React.useState('98471204938');
  const [simulatedBAC, setSimulatedBAC] = React.useState<number>(0.00);

  // Testing animation states
  const [isTestingNewDriver, setIsTestingNewDriver] = React.useState(false);
  const [testProgress, setTestProgress] = React.useState(0);
  const [testSuccess, setTestSuccess] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStep('SELECT');
      setSelectedDriverName('Mariana Silva');
      setSelectedDriverCNH('98471204938');
      setSimulatedBAC(0.00);
      setIsTestingNewDriver(false);
      setTestProgress(0);
      setTestSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_REPLACEMENT_DRIVERS[0]) => {
    setSelectedDriverName(preset.name);
    setSelectedDriverCNH(preset.cnh);
    setSimulatedBAC(preset.defaultBAC);
  };

  const handleProceedToTest = () => {
    setStep('TEST');
  };

  const handleRunReplacementTest = () => {
    setIsTestingNewDriver(true);
    setTestProgress(0);

    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTestingNewDriver(false);
          const passed = simulatedBAC === 0;
          setTestSuccess(passed);
          setStep('RESULT');
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const handleFinishHandover = () => {
    if (testSuccess) {
      const newDriver: DriverProfile = {
        id: `driver-${Date.now()}`,
        name: selectedDriverName,
        role: 'condutor_substituto',
        cnh: selectedDriverCNH,
        lastTestBAC: simulatedBAC,
        lastTestTimestamp: Date.now(),
        testPassed: true,
      };
      onConfirmReplacement(newDriver);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Protocolo de Substituição de Condutor
              </h3>
              <p className="text-[11px] text-slate-400">
                Obrigatório para liberação da ignição veicular
              </p>
            </div>
          </div>
          <button
            id="btn-close-replacement-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice of Reason */}
        <div className="px-5 py-2.5 bg-amber-950/30 border-b border-amber-900/50 flex items-center gap-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Condutor anterior <strong>{currentDriver.name}</strong> foi impedido por detecção de álcool.
          </span>
        </div>

        {/* Body Content by Step */}
        <div className="p-5 space-y-4">
          {step === 'SELECT' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                <strong className="text-white block mb-1">Passo 1: Identificação do Novo Condutor no Assento</strong>
                O novo condutor deve sentar no banco do motorista e apresentar os dados de identificação para novo teste mandatório:
              </div>

              {/* Preset Drivers */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Selecione um perfil ou insira os dados:
                </span>
                {PRESET_REPLACEMENT_DRIVERS.map((preset) => {
                  const isSelected = selectedDriverName === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full p-3 rounded-lg border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{preset.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{preset.label}</div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-slate-400">
                        CNH: {preset.cnh}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Input custom fields */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nome do Substituto:</label>
                  <input
                    id="input-replacement-name"
                    type="text"
                    value={selectedDriverName}
                    onChange={(e) => setSelectedDriverName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">CNH do Substituto:</label>
                  <input
                    id="input-replacement-cnh"
                    type="text"
                    value={selectedDriverCNH}
                    onChange={(e) => setSelectedDriverCNH(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* BAC selector for testing demonstration */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Teor Alcoólico do Substituto:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSimulatedBAC(0.00)}
                    className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                      simulatedBAC === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0,00 mg/L (Sóbrio)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedBAC(0.35)}
                    className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                      simulatedBAC > 0 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0,35 mg/L (Com Álcool)
                  </button>
                </div>
              </div>

              <button
                id="btn-proceed-to-test"
                type="button"
                onClick={handleProceedToTest}
                disabled={!selectedDriverName.trim()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                <span>Avançar para Teste de Bafômetro no Banco</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'TEST' && (
            <div className="space-y-4 text-center">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-left">
                <div className="text-slate-400">Condutor no banco do motorista:</div>
                <div className="text-sm font-bold text-white mt-0.5">{selectedDriverName}</div>
                <div className="text-[11px] text-slate-400 font-mono">CNH: {selectedDriverCNH}</div>
              </div>

              <div className="py-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-950/60 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 mb-3">
                  <Wind className={`w-8 h-8 ${isTestingNewDriver ? 'animate-spin' : ''}`} />
                </div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                  Passo 2: Teste de Amostra Alveolar Obrigatório
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  O condutor substituto precisa soprar no sensor integrado do volante para comprovar sobriedade.
                </p>
              </div>

              {isTestingNewDriver ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-cyan-300 font-bold">
                    <span>Amostragem em andamento...</span>
                    <span>{testProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${testProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  id="btn-run-replacement-test"
                  type="button"
                  onClick={handleRunReplacementTest}
                  className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-950"
                >
                  <Wind className="w-4 h-4" />
                  <span>Soprar no Sensor do Volante Agora</span>
                </button>
              )}
            </div>
          )}

          {step === 'RESULT' && (
            <div className="space-y-4 text-center">
              {testSuccess ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-black text-base text-emerald-400 uppercase tracking-wide">
                    TESTE APROVADO: 0,00 mg/L
                  </h4>
                  <p className="text-xs text-slate-300">
                    O novo condutor <strong>{selectedDriverName}</strong> foi verificado e está 100% sóbrio.
                  </p>

                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-200">
                    Bloqueio do motor de arranque <strong>DESARMADO</strong>. A ignição está pronta para partida.
                  </div>

                  <button
                    id="btn-finish-handover"
                    type="button"
                    onClick={handleFinishHandover}
                    className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Concluir Substituição & Desbloquear Carro</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-rose-400 mx-auto animate-bounce">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <h4 className="font-black text-base text-rose-400 uppercase tracking-wide">
                    NOVO CONDUTOR REPROVADO ({simulatedBAC.toFixed(2)} mg/L)
                  </h4>
                  <p className="text-xs text-rose-200">
                    O condutor substituto também acusou presença de álcool no teste alveolar!
                  </p>

                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700/80 text-xs text-rose-300">
                    O carro <strong>permanece bloqueado</strong>. É estritamente proibido ligar o veículo até que um motorista 100% sóbrio assuma o volante.
                  </div>

                  <button
                    id="btn-retry-replacement"
                    type="button"
                    onClick={() => {
                      setStep('SELECT');
                      setSimulatedBAC(0.00);
                    }}
                    className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-slate-700"
                  >
                    Tentar Outro Motorista Substituto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
