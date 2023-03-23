import React, { useCallback, useEffect, useState } from "react";
import { useDocumentTitle, useProduct } from "@/hooks";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import ShippingForm from "../checkout/step2/ShippingForm";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { buyNowProduct } from "@/redux/actions/productActions";
import { CHECKOUT_STEP_3 } from "@/constants/routes";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import CashOnDelivery from "@/views/checkout/step3/CashOnDelivery";

const BuyNow = () => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const [shippingCost, setShippingCost] = useState(200);
  const dispatch = useDispatch();
  const history = useHistory();

  const initFormikValues = {
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
      setShippingCost(200);
    } else {
      setShippingCost(250);
    }
  };

  let total = 0;
  if (product) {
    total = product.price * product.quantity + shippingCost;
  }

  const FormSchema = Yup.object().shape({
    fullname: Yup.string()
      .required("Full name is required.")
      .min(2, "Full name must be at least 2 characters long.")
      .max(60, "Full name must only be less than 60 characters."),
    email: Yup.string()
      .email("Email is not valid.")
      .required("Email is required."),
    address: Yup.string().required("Your Full address is required."),
    mobile: Yup.string().required(
      "Mobile number is required. example 031001234567"
    ),
    isInternational: Yup.boolean(),
    isDone: Yup.boolean(),
    city: Yup.object().shape({
      value: Yup.string().required("City is required"),
    }),
  });

  const onSubmitForm = useCallback(
    (form) => {
      const orderNumber = window.performance.now().toString().replace(".", "");
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
      {!isLoading && (
        <div className="checkout">
          <div className="checkout-step-1">
            <h3 className="text-center">Buy Now</h3>
            <br />
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
              initialValues={initFormikValues}
              validationSchema={FormSchema}
              onSubmit={onSubmitForm}
            >
              {() => (
                <Form>
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
                    <button className="button button-icon" type="submit">
                      Buy Now
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </main>
  );
};

export default BuyNow;
