import { AlertCircle, RefreshCw, X } from 'lucide-react';

// Estados de carregamento/erro compartilhados pelos drawers do carrinho
// e da lista de desejos.

export const LoadingSkeleton = () => (
    <div className="flex-1 overflow-hidden p-5 flex flex-col gap-4" aria-busy="true" aria-live="polite">
        {[0, 1, 2].map((index) => (
            <div key={index} className="flex gap-3 border border-gray-100 rounded-xl p-3 animate-pulse">
                <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-8 bg-gray-100 rounded w-2/3 mt-auto" />
                </div>
            </div>
        ))}
    </div>
);

export const ErrorState = ({ message, onRetry }) => (
    <div role="alert" className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-300" />
        <p className="text-gray-600">{message}</p>
        <button
            onClick={onRetry}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 underline">
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
        </button>
    </div>
);

export const ErrorBanner = ({ message, onDismiss }) => (
    <div role="alert" className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-4 py-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="flex-1">{message}</span>
        <button
            onClick={onDismiss}
            aria-label="Fechar aviso"
            className="shrink-0 hover:text-red-800 transition-colors">
            <X className="w-4 h-4" />
        </button>
    </div>
);
