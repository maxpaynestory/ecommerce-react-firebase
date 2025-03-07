import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  FEATURED_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  SHOP,
} from "@/constants/routes";
import {
  useDocumentTitle,
  useFeaturedProducts,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import bannerImg from "@/images/banner-girl.png";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseInstance from "../../services/firebase";

const Home = (props) => {
  useDocumentTitle("Sabiyya Collections | Home");
  useScrollTop();

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended,
  } = useRecommendedProducts(6);

  const history = useHistory();
  const queryParams = new URLSearchParams(props.location.search);
  const productRedirect = queryParams.get("product");
  const fbclid = queryParams.get("fbclid");

  useEffect(() => {
    if (productRedirect && productRedirect.length > 1) {
      history.push(`/product/${productRedirect}`);
    }
  }, [productRedirect, history]);

  useEffect(() => {
    if (fbclid && fbclid.length > 1) {
      firebaseInstance.logEvent("facebookAd", fbclid);
    }
  }, [fbclid]);

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              <strong>LAWN SUMMER COLLECTION</strong>
              &nbsp;every piece has <strong>FULL</strong> length
            </h1>
            <h3 className="text-thin">
              <b>Shirt:</b> 3 meter
              <br />
              <strong>Dupatta:</strong> 2.5 meter
              <br />
              <strong>Trouser:</strong> 2.5 meter
            </h3>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Featured Products</h1>
            <Link to={FEATURED_PRODUCTS}>See All</Link>
          </div>
          {errorFeatured && !isLoadingFeatured ? (
            <MessageDisplay
              message={errorFeatured}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={featuredProducts}
              skeletonCount={6}
            />
          )}
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Recommended Products</h1>
            <Link to={RECOMMENDED_PRODUCTS}>See All</Link>
          </div>
          {errorRecommended && !isLoadingRecommended ? (
            <MessageDisplay
              message={errorRecommended}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
