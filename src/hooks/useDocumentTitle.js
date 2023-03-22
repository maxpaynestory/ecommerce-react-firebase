import { useLayoutEffect } from 'react';

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'Sabiyya Collections - Online Store';
    }
  }, [title]);
};

export default useDocumentTitle;
