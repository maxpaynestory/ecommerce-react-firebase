import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebase from "@/services/firebase";

const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const didMount = useDidMount(true);

  useEffect(async () => {
    try {
      const doc = await firebase.getSingleProduct(id);

      if (doc.exists) {
        const data = { ...doc.data(), id: doc.ref.id };

        if (didMount) {
          setProduct(data);
          setLoading(false);
        }
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      if (didMount) {
        setLoading(false);
        setError(err?.message || "Something went wrong.");
      }
    }
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
