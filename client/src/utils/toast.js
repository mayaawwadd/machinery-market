import { toast } from 'react-toastify';

let displayed = new Set();

const showToast = (type, message, options = {}) => {
  if (displayed.has(message)) return;

  const id = toast[type](message, {
    position: 'top-center',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    onClose: () => displayed.delete(message),
    ...options,
  });

  displayed.add(message);
  return id;
};

// Export helpers for different toast types
export const showSuccess = (msg, opts) => showToast('success', msg, opts);
export const showError = (msg, opts) => showToast('error', msg, opts);
export const showInfo = (msg, opts) => showToast('info', msg, opts);
export const showWarn = (msg, opts) => showToast('warn', msg, opts);
