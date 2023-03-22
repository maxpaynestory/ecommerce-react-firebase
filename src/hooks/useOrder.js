import firebase from '@/services/firebase';
import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';

const useOrder = (orderNumber) => {
  const [order, setOrder] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(async () => {
    try {
      if (order) {
        setLoading(true);
        const rs = await firebase.getOrder(orderNumber);

        if (rs.docs.length > 0) {
          const data = { ...rs.docs[0].data() };

          if (didMount) {
            setOrder(data);
            setLoading(false);
          }
        } else {
          setError('Order not found.');
        }
      }
    } catch (err) {
      if (didMount) {
        setLoading(false);
        setError(err?.message || 'Something went wrong.');
      }
    }
  }, [orderNumber]);
  return { order, isLoading, error };
}
export default useOrder;