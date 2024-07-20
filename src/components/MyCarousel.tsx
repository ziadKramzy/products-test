import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import DeleteBtn from "./DeleteBtn";
import Example from "./MyButton";
import "react-multi-carousel/lib/styles.css";
import "../pages/ProductsPage/Products.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

interface Product {
  Id: number;
  Sku: string;
  name: string;
  Price: number;
  Height?: number | null;
  Width?: number | null;
  Length?: number | null;
  Size?: number | null;
  Weight?: number | null;
}

interface CarouselProps {
  deviceType: string;
}

const MyCarousel: React.FC<CarouselProps> = ({ deviceType }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:80/api/products/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const deletedProductIds = getDeletedProductIds();
        const filteredProducts = data.filter(
          (product: Product) => !deletedProductIds.includes(product.Id)
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      }
    }

    fetchProducts();
  }, []);

  const massDeleteProducts = async () => {
    try {
      await Promise.all(
        selectedProducts.map((Id) =>
          fetch(`http://localhost:80/api/products/${Id}/delete`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete product with ID ${Id}`);
            }
            updateDeletedProductIds(Id);
          })
        )
      );

      const updatedProducts = products.filter(
        (product) => !selectedProducts.includes(product.Id)
      );
      setProducts(updatedProducts);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      setError("Failed to delete products.");
    }
  };

  const handleCheckboxChange = (Id: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(Id)
        ? prevSelected.filter((selectedId) => selectedId !== Id)
        : [...prevSelected, Id]
    );
  };

  const getDeletedProductIds = (): number[] => {
    const deletedIdsString = localStorage.getItem("deletedProductIds");
    return deletedIdsString ? JSON.parse(deletedIdsString) : [];
  };

  const updateDeletedProductIds = (deletedId: number) => {
    const deletedIds = getDeletedProductIds();
    const updatedDeletedIds = [...deletedIds, deletedId];
    localStorage.setItem(
      "deletedProductIds",
      JSON.stringify(updatedDeletedIds)
    );
  };

  const renderCarousel = (products: Product[], title: string) => (
    <div className="carouselPage">
      <h3>{title}</h3>
      <Carousel
        swipeable={false}
        draggable={false}
        showDots={false}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={deviceType !== "mobile" ? false : false}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
      >
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="carouselItem">
              <input
                className="checkMark"
                type="checkbox"
                checked={selectedProducts.includes(product.Id)}
                onChange={() => handleCheckboxChange(product.Id)}
              />
              <br />
              <div className="itemBody">
                Sku: {product.Sku} <br />
                Name: {product.name} <br />
                Price: {product.Price} <br />
                {product.Height != null &&
                  product.Width != null &&
                  product.Length != null && (
                    <>
                      Height: {product.Height} &nbsp; Width: {product.Width}{" "}
                      &nbsp; Length: {product.Length} <br />
                    </>
                  )}
                {product.Size != null && (
                  <>
                    Size: {product.Size} <br />
                  </>
                )}
                {product.Weight != null && (
                  <>
                    Weight: {product.Weight} <br />
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="carouselItem">Loading...</div>
        )}
      </Carousel>
    </div>
  );

  const productsWithDimensions = products.filter(
    (product) =>
      product.Height != null && product.Width != null && product.Length != null
  );
  const productsWithWeight = products.filter(
    (product) => product.Weight != null
  );
  const productsWithSize = products.filter((product) => product.Size != null);

  return (
    <div>
      <div className="flex flex-row p-4 ">
        <h2 className="text-zinc-50 w-full h-fit m-8">Products List</h2>
        <div className="w-full flex flex-row place-content-end h-fit ">
          <span className="mt-2">
            <Example />
          </span>
          <DeleteBtn onDeleteSelected={massDeleteProducts} />
        </div>
      </div>

      {renderCarousel(productsWithDimensions, "Furniture")}
      {renderCarousel(productsWithWeight, "Books")}
      {renderCarousel(productsWithSize, "DVD")}
    </div>
  );
};

export default MyCarousel;
