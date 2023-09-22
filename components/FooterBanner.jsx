import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";

const FooterBanner = ({
  footerBanner: {
    discount,
    largeText1,
    largeText2,
    saleTime,
    smallText,
    midText,
    desc,
    product,
    buttonText,
    image,
  },
}) => {
  return (
    <div className="hero-banner-container" style={{backgroundColor: '#8c52ff'}}>
      <div>
        <p className="beats-solo">{smallText}</p>
        <h3>{midText}</h3>
        <h1>{largeText1}</h1>
        <h1>{largeText2}</h1>
        <img
          src={urlFor(image)}
          alt="headphones"
          className="hero-banner-image"
        />
        <div>
          <div className="desc">
            <h5 style={{color: '#fff'}}>Descrição</h5>
            <p style={{color: '#fff'}}>{desc}</p>
            <Link href={`/product/${product}`}>
              <button type="button" style={{backgroundColor: '#fff', color: '#8c52ff'}}>{buttonText}</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
