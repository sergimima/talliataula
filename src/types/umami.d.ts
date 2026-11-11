// API global que expone el script de Umami (estadísticas sin cookies) cuando está cargado.
interface Window {
  umami?: {
    track: (event: string, data?: Record<string, string | number>) => void;
  };
}
