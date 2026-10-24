import { useEffect } from 'react';

export function useEnterToSubmitForms() {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof HTMLElement) || !target.matches('input, select')) {
        return;
      }

      const form = target.closest('form');

      if (!form) {
        return;
      }

      event.preventDefault();
      form.requestSubmit();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
