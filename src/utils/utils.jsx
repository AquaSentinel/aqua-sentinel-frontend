import {toast} from 'react-toastify';
import { FiDownload } from "react-icons/fi"; // make sure to install: npm install react-icons
export const handleSucess = (msg)=>{
    toast.success(msg,{
        position : 'top-right'
    })
}

export const handleError = (msg)=>{
    toast.error(msg,{
        position : 'top-right'
    })
}

/* ---------- UI atoms ---------- */ // Uncomment when you use Panel.jsx
// export const Step = ({ n, label, active, done }) => (
//   <div className="flex items-center gap-2">
//     <div
//       className={[
//         "h-7 w-7 flex items-center justify-center rounded-full text-xs font-semibold",
//         done
//           ? "bg-indigo-600 text-white"
//           : active
//           ? "bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
//           : "bg-gray-900/5 text-gray-700 ring-1 ring-gray-200 dark:bg-white/10 dark:text-gray-300 dark:ring-white/10",
//       ].join(" ")}
//     >
//       {done ? "✓" : n}
//     </div>
//     <span
//       className={
//         active || done
//           ? "text-gray-900 dark:text-gray-100 text-sm"
//           : "text-gray-600 dark:text-gray-300 text-sm"
//       }
//     >
//       {label}
//     </span>
//   </div>
// );

// export const ImageLightbox = ({ open, src, alt, onClose, caption }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[60]">
//       <div className="absolute inset-0 bg-black/80" onClick={onClose} />
//       <div className="absolute inset-0 flex items-center justify-center p-4">
//         <div className="relative max-w-5xl w-full">
//           <button
//             onClick={onClose}
//             className="absolute -top-3 -right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow hover:bg-white"
//           >
//             ✕ Close
//           </button>
//           <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">
//             <div className="p-3 text-xs text-gray-700 dark:text-gray-300">{caption}</div>
//             <img
//               src={src}
//               alt={alt || "Preview"}
//               className="w-full h-[70vh] object-contain bg-gray-50 dark:bg-slate-800"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
