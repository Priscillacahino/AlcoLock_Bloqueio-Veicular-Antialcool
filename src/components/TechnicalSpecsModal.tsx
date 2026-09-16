import React from 'react';
import { X, Cpu, Shield, CheckCircle2, Car, AlertTriangle, Hand, Sparkles, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Arquitetura do Sistema • DADSS & Dupla Validação
              </h3>
              <p className="text-[11px] text-slate-400">
                Detecção óptica por infravermelho na palma da mão, sensor de assento e corte de ignição
              </p>
            </div>
          </div>
          <button
            id="btn-close-specs-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Section 1: Concept & Dual Validation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Hand className="w-4 h-4" />
              <span>1. Conceito Central: O Volante Inteligente com Leitura Óptica na Palma</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Em vez de exigir que o motorista sopre em um bafômetro toda vez que entrar no carro, o sistema utiliza o fluxo natural de condução:
            </p>
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/60 font-medium text-cyan-200 text-xs">
              <strong>Motorista entra → senta no banco → coloca a mão no volante → sensor reconhece a palma → leitura óptica de álcool → partida liberada ou bloqueada.</strong>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Essa abordagem de <strong>dupla validação (Banco + Palma)</strong> garante que apenas o ocupante do assento do motorista esteja sendo analisado, eliminando interferências ambientais de passageiros.
            </p>
          </div>

          {/* Section 2: Technology Comparison (DADSS vs Sweat vs Breath) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>2. Comparativo Tecnológico: Leitura Óptica vs. Suor Transdérmico vs. Bafômetro</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 rounded-lg overflow-hidden text-[11px]">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="p-2.5 font-semibold">Tecnologia</th>
                    <th className="p-2.5 font-semibold">O que detecta</th>
                    <th className="p-2.5 font-semibold">Tempo de Resposta</th>
                    <th className="p-2.5 font-semibold">Aplicação Veicular</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="bg-emerald-950/20">
                    <td className="p-2.5 font-bold text-emerald-300">Infravermelho na Palma (DADSS)</td>
                    <td className="p-2.5">Álcool nos tecidos e capilares sanguíneos (espectroscopia NIR)</td>
                    <td className="p-2.5 font-mono text-emerald-400">Imediato (1 a 3 segundos)</td>
                    <td className="p-2.5 font-semibold text-emerald-300">🟢 Principal e Mais Promissor</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-amber-300">Sensor Transdérmico / Suor</td>
                    <td className="p-2.5">Etanol eliminado pela transpiração dérmica</td>
                    <td className="p-2.5 font-mono text-amber-400">Lento (atraso de 45-90 min)</td>
                    <td className="p-2.5 text-slate-400">🟡 Complementar (não confiável isolado)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-cyan-300">Bafômetro (Ar Alveolar)</td>
                    <td className="p-2.5">Álcool nos alvéolos pulmonares</td>
                    <td className="p-2.5 font-mono text-cyan-400">Rápido (~5 a 10 segundos)</td>
                    <td className="p-2.5 text-slate-400">🟢 Preciso, porém exige sopro invasivo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              O atraso da concentração transdérmica no suor em relação à concentração sanguínea é um limitador conhecido na literatura médica (PMC9052024). Já a <strong>espectroscopia óptica capilar na palma (programa DADSS)</strong> ilumina os capilares dérmicos com luz infravermelha próxima, analisando as assinaturas de absorção das ligações O-H do etanol sem depender da excreção de suor.
            </p>
          </div>

          {/* Section 3: Physical Placement in Vehicle */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Car className="w-4 h-4" />
              <span>3. Pontos Naturais de Contato no Cockpit</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Os sensores ópticos DADSS são instalados nos pontos onde o condutor já precisa tocar por padrão:
            </p>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li><strong>Empunhadura do Volante (3h e 9h):</strong> Sensores de palma em ambos os lados com LEDs NIR e fotodetectores de alta velocidade.</li>
              <li><strong>Superfície do Botão Start/Stop:</strong> Sensor de toque capacitivo com anel de espectroscopia para análise no instante em que o motorista pressiona a ignição.</li>
              <li><strong>Alavanca seletora de marchas:</strong> Leitura contínua ao engatar a marcha.</li>
            </ul>
          </div>

          {/* Section 4: Lockout and Handover */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>4. Bloqueio Eletrônico e Notificação do Motorista Alternativo</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Constatado álcool acima da tolerância, a central CAN bloqueia o motor de arranque e aciona o módulo de emergência. O carro permanece travado até que a <strong>presença física de um condutor substituto sóbrio seja confirmada</strong> no assento através de leitura óptica de sobriedade e validação de dispositivo pareado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
