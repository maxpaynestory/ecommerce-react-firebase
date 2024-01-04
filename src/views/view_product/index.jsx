import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { ColorChooser, ImageLoader, MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { RECOMMENDED_PRODUCTS, SHOP } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Select from "react-select";
import firebaseInstance from "../../services/firebase";

const ViewProduct = (props) => {
  const { id } = useParams();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const history = useHistory();
  const queryParams = new URLSearchParams(props.location.search);
  const fbclid = queryParams.get("fbclid");

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  useEffect(() => {
    if (fbclid && fbclid.length > 1) {
      firebaseInstance.logEvent("facebookAd", fbclid);
    }
  }, [fbclid]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedSize(newValue.value);
  };

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
    }
  };

  const handleAddToBasket = () => {
    addToBasket({
      ...product,
      selectedColor,
      selectedSize: selectedSize || product.sizes[0],
    });
  };

  useDocumentTitle(`Sabiyya Collections - ${product?.name}`);

  const productSizes =
    product?.sizes
      .sort((a, b) => (a < b ? -1 : 1))
      .map((size) => ({ label: `${size} meter`, value: size })) || [];

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: "3rem" }} />
        </div>
      )}
      {error && <MessageDisplay message={error} />}
      {product && !isLoading && (
        <div className="product-view">
          <Link to={SHOP}>
            <h3 className="button-link d-inline-flex">
              <ArrowLeftOutlined />
              &nbsp; Back to shop
            </h3>
          </Link>
          <div className="product-modal">
            {product.imageCollection.length !== 0 && (
              <div className="product-modal-image-collection">
                {product.imageCollection.map((image) => (
                  <div
                    className="product-modal-image-collection-wrapper"
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    role="presentation"
                  >
                    <ImageLoader
                      className="product-modal-image-collection-img"
                      src={image.url}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="product-modal-image-wrapper">
              {selectedColor && (
                <input
                  type="color"
                  disabled
                  ref={colorOverlay}
                  id="color-overlay"
                />
              )}
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
            </div>
            <div className="product-modal-details">
              <br />
              <span className="text-subtle">{product.brand}</span>
              <h1 className="margin-top-0">{product.name}</h1>
              <span>{product.description}</span>
              <br />
              <br />
              <div className="divider" />
              <br />
              <div>
                <span className="text-subtle">Total size</span>
                <br />
                <br />
                <Select
                  placeholder="--Select Size--"
                  onChange={onSelectedSizeChange}
                  options={productSizes}
                  defaultValue={
                    productSizes.length > 0 ? productSizes[0] : null
                  }
                />
              </div>
              <br />
              {product.availableColors.length >= 1 && (
                <div>
                  <span className="text-subtle">Choose Color</span>
                  <br />
                  <br />
                  <ColorChooser
                    availableColors={product.availableColors}
                    onSelectedColorChange={onSelectedColorChange}
                  />
                </div>
              )}
              <h1>{displayMoney(product.price)}</h1>
              <div className="product-modal-action">
                {/*}<button
                  className={`button button-small ${isItemOnBasket(product.id) ? 'button-border button-border-gray' : ''}`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  {isItemOnBasket(product.id) ? 'Remove From Basket' : 'Add To Basket'}
              </button>{*/}
                <button
                  className="button button-small"
                  onClick={() => history.push(`/buynow/${product.id}`)}
                  disabled={product.maxQuantity < 1 ? true : false}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewProduct;
