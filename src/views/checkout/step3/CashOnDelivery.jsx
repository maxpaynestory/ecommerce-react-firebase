/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
import React, { useEffect, useRef, useCallback } from 'react';
import { Field, useFormikContext } from 'formik';

const CashOnDelivery = () => {
  const { values, setValues } = useFormikContext();
  const collapseContainerRef = useRef(null);
  const cardInputRef = useRef(null);
  const containerRef = useRef(null);
  const checkboxContainerRef = useRef(null);

  const toggleCollapse = useCallback(() => {
    const cn = containerRef.current;
    const cb = checkboxContainerRef.current;
    const cl = collapseContainerRef.current;

    if (cb && cn && cl) {
      if (values.type === 'credit') {
        cardInputRef.current.focus();
        cn.style.height = `${cb.offsetHeight + cl.offsetHeight}px`;
      } else {
        cardInputRef.current.blur();
        cn.style.height = `${cb.offsetHeight}px`;
      }
    }
  },[containerRef, checkboxContainerRef, collapseContainerRef, cardInputRef]);

  const onCreditModeChange = useCallback((e) => {
    if (e.target.checked) {
      setValues({ ...values, type: 'cod' });
      //toggleCollapse();
    }
  }, [values, setValues]);
  return (
    <>
      <div ref={containerRef} className={`checkout-fieldset-collapse ${values.type === 'cod' ? 'is-selected-payment' : ''}`}>
        <div className="checkout-field margin-0">
          <div className="checkout-checkbox-field" ref={checkboxContainerRef}>
            <input
              checked={values.type === 'cod'}
              id="modeCod"
              name="type" // the field name in formik I used is type
              onChange={onCreditModeChange}
              type="radio"
            />
            <label
              className="d-flex w-100"
              htmlFor="modeCod"
            >
              <div className="d-flex-grow-1 margin-left-s">
                <h4 className="margin-0">Cash on delivery</h4>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
export default CashOnDelivery;