import React from 'react';
import { X, Car, PhoneCall, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

export const EmergencyRideModal: React.FC<Props> = ({ isOpen, onClose, driverName }) => {
  const [calledService, setCalledService] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCall = (service: string) => {
    setCalledService(service);
    setTimeout(() => {
      // Keep feedback
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950 border border-rose-800 text-rose-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Alternativas Seguras de Transporte
              </h3>
              <p className="text-[11px] text-slate-400">
                Veículo imobilizado por segurança de trânsito
              </p>
            </div>
          </div>
          <button
            id="btn-close-emergency-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-200">
            <strong>Atenção {driverName}:</strong> A direção sob efeito de álcool coloca vidas em perigo e configura infração gravíssima com suspensão da CNH. O veículo permanecerá travado.
          </div>

          {calledService ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-sm text-emerald-300">
                {calledService} Solicitado com Sucesso!
              </div>
              <div className="text-[11px] text-slate-300">
                Previsão de chegada: <strong>4 a 7 minutos</strong> no local do veículo.
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <button
                id="btn-call-uber"
                type="button"
                onClick={() => handleCall('Motorista de Aplicativo (Uber/99)')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black text-white font-black text-xs border border-slate-700">
                    APP
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Chamar Carona por Aplicativo</div>
                    <div className="text-[10px] text-slate-400">Uber / 99 para o endereço atual</div>
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                id="btn-call-contact"
                type="button"
                onClick={() => handleCall('Contato de Confiança (Família)')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-950 text-blue-300 border border-blue-800">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Ligar para Amigo da Rodada / Família</div>
                    <div className="text-[10px] text-slate-400">Pedir para assumir o volante e desbloquear o carro</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">DISCAR</span>
              </button>

              <button
                id="btn-call-assist"
                type="button"
                onClick={() => handleCall('Seguro & Assistência 24h')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Assistência Veicular / Guincho</div>
                    <div className="text-[10px] text-slate-400">Remoção segura do veículo para garagem</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">0800</span>
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
