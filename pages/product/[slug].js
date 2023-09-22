import React, { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, sizes, colors } = product;
  const [index, setIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setselectedColor] = useState(colors[0]);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = () => {
    if (selectedSize, selectedColor) {
      // Verifica se um tamanho foi selecionado
      onAdd(product, qty, selectedSize, selectedColor);
      setShowCart(true);
    } else {
      // Adicione aqui um tratamento para o caso em que nenhum tamanho foi selecionado
      alert("Por favor, selecione um tamanho.");
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Detalhes: </h4>
          <p>{details}</p>
          <div className="mt-4">
            <h4>
              Tamanho: <strong>{selectedSize}</strong>
            </h4>
            <div className="small-images-container">
              {sizes.map((size) => (
                <button
                  onClick={() => setSelectedSize(size)}
                  key={size}
                  variant={ selectedSize === size }
                  // className="size-detail"
                  className={`size ${size === selectedSize ? 'size-detail-active' : 'size-detail'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h4>
              Cor: <strong>{selectedColor}</strong>
            </h4>
            <div className="small-images-container">
              {colors.map((color) => (
                <button
                  onClick={() => setselectedColor(color)}
                  key={color}
                  variant={ selectedColor === color }
                  // className="size-detail"
                  className={`size ${color === selectedColor ? 'color-detail-active' : 'color-detail'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <p className="price">R${price}</p>
          <div className="quantity">
            <h3>Quantidade:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty, selectedSize, selectedColor)}
            >
              Adicionar no carrinho
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Comprar agora
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>você pode gostar</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';
  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);
  console.log(product);
  return {
    props: { products, product },
  };
};

export default ProductDetails;
