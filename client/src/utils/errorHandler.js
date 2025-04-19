import { showError } from './toast';

export const handleApiError = (
  error,
  fallbackMessage = 'Something went wrong.'
) => {
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  showError(message);
};
