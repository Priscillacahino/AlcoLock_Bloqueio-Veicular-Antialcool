import React from 'react';
import { X, Cpu, Car, AlertTriangle, Hand, Wind, FlaskConical } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Arquitetura conceitual • referências de pesquisa
              </h3>
              <p className="text-[11px] text-slate-400">
                Simulação acadêmica — sem hardware automotivo implementado ou homologado
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-200">O que esta tela representa</strong>
              <p className="text-slate-300 leading-relaxed">
                Os sensores, o bloqueio de partida, o pareamento e as leituras exibidas são cenários de software para estudar fluxo, UX e regras de segurança. Não há integração real com ECU/CAN, instrumento de medição certificado ou dispositivo pronto para instalação em veículo.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Hand className="w-4 h-4" />
                <span>Leitura óptica por toque</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                O DADSS pesquisou espectroscopia de tecido por contato para estimar álcool. A capacidade de medição em laboratório foi demonstrada, mas a própria fonte oficial informa que o desenvolvimento do sistema touch foi suspenso em abril de 2025, e que ainda seriam necessários avanços para requisitos automotivos de durabilidade, custo e produção em escala.
              </p>
              <p className="text-[11px] text-slate-400">
                No AlcoLock, o volante e o botão ópticos permanecem como referência conceitual, não como especificação de um produto disponível.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Wind className="w-4 h-4" />
                <span>Detecção passiva por respiração</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                O programa DADSS mantém como linha prioritária a tecnologia passiva de respiração. As datas de desenvolvimento e licenciamento divulgadas são estimativas do programa e podem mudar.
              </p>
              <p className="text-[11px] text-slate-400">
                Para o AlcoLock, essa linha serve como referência para estudos futuros de sensores de ar e do conceito de coleta próxima ao motorista.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <FlaskConical className="w-4 h-4" />
              <span>Interpretação no protótipo</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>valores exibidos são dados simulados;</li>
              <li>“aprovado” e “não aprovado” significam apenas resultado do cenário configurado;</li>
              <li>resultado inconclusivo e sensor indisponível não são tratados como confirmação de consumo de álcool;</li>
              <li>presença do motorista substituto e aprovação do teste são etapas separadas;</li>
              <li>nenhum valor da interface deve ser usado para decisão clínica, policial, jurídica ou automotiva real.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Car className="w-4 h-4" />
              <span>Integração veicular futura</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Uma implementação real exigiria engenharia automotiva, análise de risco, segurança funcional, calibração, redundância, proteção contra falhas, requisitos regulatórios, privacidade, testes ambientais e homologação. O projeto atual não executa essas funções.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            Referências: documentação oficial do Driver Alcohol Detection System for Safety (DADSS), especialmente as páginas “Touch Technology” e “Commercial Availability”. Consulte também <code>docs/referencias.md</code>.
          </div>
        </div>
      </div>
    </div>
  );
};
