import React, { useCallback, useEffect, useState } from "react";
import { useDocumentTitle, useProduct } from "@/hooks";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import ShippingForm from "../checkout/step2/ShippingForm";
import { Formik, Field } from "formik";
import { CustomInput } from "@/components/formik";
import * as Yup from "yup";
import { buyNowProduct } from "@/redux/actions/productActions";
import { CHECKOUT_STEP_3 } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import CashOnDelivery from "@/views/checkout/step3/CashOnDelivery";
import moment from "moment";
import { displayActionMessage } from "../../helpers/utils";
import firebaseInstance from "../../services/firebase";

const BuyNow = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const [shippingCost, setShippingCost] = useState(200);
  const [showShoppingForm, setShowShoppingForm] = useState(true);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [filledForm, setFilledForm] = useState({});
  const [confirmationResult, setConfirmationResult] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const initShippingValues = {
    fullname: "",
    email: "",
    address: "",
    mobile: "",
    isInternational: false,
    isDone: false,
    city: { label: "Lahore", value: "Lahore" },
    type: "cod",
  };

  const onChangeCity = (s) => {
    if (s.value === "Lahore") {
      /// lahore to lahore
      setShippingCost(200);
    } else {
      //// lahore to any city of Pakistan
      setShippingCost(300);
    }
    displayActionMessage("Delivery fee changed");
  };

  let total = 0;
  if (product) {
    total = product.price * product.quantity + shippingCost;
  }

  const shippingFormValidation = Yup.object().shape({
    fullname: Yup.string()
      .required("Full name is required.")
      .min(2, "Full name must be at least 2 characters long.")
      .max(60, "Full name must only be less than 60 characters."),
    email: Yup.string()
      .email("Email is not valid.")
      .required("Email is required."),
    address: Yup.string().required("Your Full address is required."),
    mobile: Yup.string()
      .required("Mobile number is required. example 031001234567")
      .length(11, "Mobile number is required. example 031001234567")
      .matches(/^(\d)+$/, "Mobile number is required. example 031001234567"),
    isInternational: Yup.boolean(),
    isDone: Yup.boolean(),
    city: Yup.object().shape({
      value: Yup.string().required("City is required"),
    }),
  });

  const otpFormValidation = Yup.object().shape({
    otp: Yup.string()
      .required()
      .length(6)
      .matches(/^(\d)+$/),
  });

  const onSubmitForm = useCallback(
    (form) => {
      let numberPart = window.performance.now().toString().replace(".", "");
      numberPart = numberPart.substring(
        numberPart.length - 5,
        numberPart.length
      );
      const orderNumber = `${moment(new Date()).format(
        "YYYY-MM-DD"
      )}-${numberPart}`;
      dispatch(
        buyNowProduct(
          product,
          {
            fullname: form.fullname,
            email: form.email,
            address: form.address,
            mobile: form.mobile,
            isInternational: false,
            isDone: true,
            city: form.city,
            type: form.type,
          },
          orderNumber,
          total,
          shippingCost
        )
      );
      history.push("/order/" + orderNumber);
    },
    [
      CHECKOUT_STEP_3,
      dispatch,
      buyNowProduct,
      history,
      product,
      window,
      total,
      shippingCost,
    ]
  );

  const onShippingFormSubmit = useCallback((form) => {
    setFilledForm(form);
    onCaptchVerify();
    const intlPhoneNumber = "+92" + form.mobile.slice(1);
    firebaseInstance
      .signInWithPhoneNumber(intlPhoneNumber, window.recaptchaVerifier)
      .then((res) => {
        setConfirmationResult(res);
        setShowShoppingForm(false);
        setShowOTPForm(true);
      })
      .catch((error) => {
        console.log("Error firebaseInstance.signInWithPhoneNumber ", error);
      });
  });

  const onOTPFormSubmit = useCallback(
    (form) => {
      confirmationResult
        .confirm(form.otp)
        .then(async (res) => {
          onSubmitForm(filledForm);
        })
        .catch((err) => {
          console.log("confirmationResult err", err);
        });
    },
    [confirmationResult, filledForm]
  );

  const onCaptchVerify = useCallback(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier =
        new firebaseInstance.app.auth.RecaptchaVerifier("recaptcha-container", {
          size: "invisible",
        });
    }
  }, [filledForm, firebaseInstance]);

  useDocumentTitle("Buy Now | Sabiyya Collections");

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: "3rem" }} />
        </div>
      )}
      {!isLoading && showShoppingForm && (
        <div className="checkout">
          <div className="checkout-step-1">
            <div className="basket-item">
              <div className="basket-item-wrapper">
                <div className="basket-item-img-wrapper">
                  <ImageLoader
                    alt={product.name}
                    className="basket-item-img"
                    src={product.image}
                  />
                </div>
                <div className="basket-item-details">
                  <h4 className="basket-item-name">{product.name}</h4>
                </div>
                <div className="basket-item-price text-right">
                  <h4 className="my-0">
                    {displayMoney(product.price * product.quantity)}
                  </h4>
                </div>
              </div>
            </div>
            <div className="basket-item">
              <div className="basket-item-details">Delivery Fee</div>
              <div className="basket-item-price text-right">
                <h4 className="my-0">{displayMoney(shippingCost)}</h4>
              </div>
            </div>
            <div className="basket-item">
              <div className="basket-item-details">Total</div>
              <div className="basket-item-price text-right">
                <h4 className="my-0">{displayMoney(total)}</h4>
              </div>
            </div>
            <h3 className="text-center">Shipping Details</h3>
            <br />
            <Formik
              validateOnChange
              initialValues={initShippingValues}
              validationSchema={shippingFormValidation}
              onSubmit={onShippingFormSubmit}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <ShippingForm
                    onChangeCity={onChangeCity}
                    showSimpleMobile={true}
                  />
                  <h3 className="text-center">Payment</h3>
                  <br />
                  <span className="d-block padding-s">Payment Option</span>
                  <CashOnDelivery />
                  <div
                    style={{
                      flex: 1,
                      marginTop: 10,
                    }}
                    className="text-right"
                  >
                    <button
                      className="button button-icon"
                      type="submit"
                      disabled={product.maxQuantity < 1 ? true : false}
                    >
                      Buy Now
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
      {showOTPForm && (
        <div className="checkout">
          <div className="checkout-step-1">
            <h3 className="text-center">Verify OTP</h3>
            <br />
            <p>
              We have sent you a OTP on {filledForm.mobile}. Please check your
              SMS
            </p>
            <Formik
              validateOnChange
              initialValues={{
                otp: "",
              }}
              validationSchema={otpFormValidation}
              onSubmit={onOTPFormSubmit}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="checkout-shipping-wrapper">
                    <div className="checkout-shipping-form">
                      <div className="d-block checkout-field">
                        <Field
                          name="otp"
                          label="* OTP"
                          placeholder="Enter OTP from SMS"
                          component={CustomInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      marginTop: 10,
                    }}
                    className="text-right"
                  >
                    <button className="button button-icon" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </main>
  );
};

export default BuyNow;
