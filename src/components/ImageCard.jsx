import { DownloadBtn } from "./DownloadBtn";
export function ImageCard({ title, src, placeholder, onDownload }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</div>
        <DownloadBtn disabled={!src} onClick={onDownload} />
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {src ? (
          <img src={src} alt={title} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-gray-500 dark:text-gray-400">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}