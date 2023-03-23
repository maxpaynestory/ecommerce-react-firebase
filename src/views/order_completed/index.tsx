import React from "react";
import { useParams } from "react-router-dom";
import { useDocumentTitle, useOrder } from "@/hooks";
import { LoadingOutlined } from "@ant-design/icons";
import { displayMoney } from "@/helpers/utils";

const OrderCompleted = () => {
  const { orderNumber } = useParams();
  const { order, isLoading, error } = useOrder(orderNumber);

  useDocumentTitle("Your Order | Sabiyya Collections");

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Order...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: "3rem" }} />
        </div>
      )}
      {order.product && !isLoading && (
        <div className="checkout">
          <div className="checkout-step-1">
            <h1 className="text-center">Thank you for your order!</h1>
            <br />
            <h3>Hi {order.guestUserInfo.fullname},</h3>
            <p>
              Your order # {order.orderNumber} has been placed successfully and
              we will contact you on your phone{" "}
              {order.guestUserInfo.mobile.value} for order confirmation.
            </p>
            <br />
            <h3>Delivery Details</h3>
            <p>Full name: {order.guestUserInfo.fullname}</p>
            <p>Address: {order.guestUserInfo.address}</p>
            <p>Phone: {order.guestUserInfo.mobile}</p>
            <p>Email: {order.guestUserInfo.email}</p>
            <p>Delivery Fee: {displayMoney(order.shippingCost)}</p>
            <p>Order Total: {displayMoney(order.total)}</p>
          </div>
        </div>
      )}
    </main>
  );
};
export default OrderCompleted;
