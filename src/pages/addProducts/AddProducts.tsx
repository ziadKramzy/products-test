import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ActiveExample from "../../components/submitBtns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSquareCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./addProducts.css";

const AddProducts = () => {
  const [showDimensions, setShowDimensions] = useState(false);
  const [weightDimension, setWeightDimension] = useState(false);
  const [sizeDimension, setSizeDimension] = useState(false);
  const [inputs, setInputs] = useState<{
    [key: string]: string | number | null;
  }>({
    Sku: "",
    name: "",
    Price: "",
    Size: null,
    Weight: null,
    Height: null,
    Width: null,
    Length: null,
  });
  const [open, setOpen] = useState(false);
  const [visible, setVisibility] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setInputs((values) => ({
      ...values,
      [name]: type === "number" ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs before submitting
    if (!inputs.Sku || !inputs.name || !inputs.Price) {
      setError("SKU, name, and price are required.");
      return;
    }

    // Check if at least one of Hwl, Size, or Weight is provided
    if (
      !(inputs.Height && inputs.Width && inputs.Length) &&
      !inputs.Size &&
      !inputs.Weight
    ) {
      setError(
        "Please provide at least one of Hwl (Height, Width, Length), Size, or Weight."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:80/api/products/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        setError(data.error || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error occurred.");
    }
  };

  const showHwl = () => {
    setShowDimensions(!showDimensions);
    setVisibility(!visible);
  };

  const showSize = () => {
    setSizeDimension(!sizeDimension);
    setVisibility(!visible);
  };

  const showWeight = () => {
    setWeightDimension(!weightDimension);
    setVisibility(!visible);
  };

  return (
    <div className="page">
      <form onSubmit={handleSubmit} id="product-form" className="flex flex-col">
        <div className="navContainer">
          <div className="title">
            <label className="mt-4"> Add Products </label>
          </div>
          <div className="buttonsContainer">
            <ActiveExample />
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        <div className="flex flex-col gap-4">
          <div id="sku">
            <label>Sku:</label> <br />
            <input
              required
              type="text"
              placeholder="#Sku"
              name="Sku"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Name</label> <br />
            <input
              required
              type="text"
              name="name"
              placeholder="#Name"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Price ($):</label> <br />
            <input
              required
              type="number"
              name="Price"
              placeholder="#Price"
              onChange={handleChange}
            />
          </div>
          <div>
            <div className={`menu-trigger ${visible ? "active" : "inactive "}`}>
              <label
                className=" p-1 font-extralight text-lg"
                onClick={() => setOpen(!open)}
              >
                Type Switcher <FontAwesomeIcon icon={faCaretDown} />
              </label>

              <br />
            </div>
            <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
              <ul className="flex flex-col gap-2">
                <li
                  onClick={showSize}
                  className={`size ${visible ? "active" : "inactive"} `}
                >
                  DVD
                </li>
                {sizeDimension && (
                  <div id="DVD">
                    <label className="topLabel" onClick={showSize}>
                      <FontAwesomeIcon icon={faSquareCaretLeft} /> DVD
                    </label>
                    <br />
                    <label>Size (Mb) </label> <br />
                    <input
                      required
                      type="text"
                      name="Size"
                      placeholder="#size"
                      onChange={handleChange}
                    />
                  </div>
                )}
                <li
                  onClick={showWeight}
                  className={`weight ${visible ? "active" : "inactive"}`}
                >
                  Books
                </li>
                {weightDimension && (
                  <div id="weight">
                    <label className="topLabel" onClick={showWeight}>
                      <FontAwesomeIcon icon={faSquareCaretLeft} /> Books
                    </label>{" "}
                    <br />
                    <label>Weight(kg)</label> <br />
                    <input
                      required
                      type="text"
                      name="Weight"
                      placeholder="#weight"
                      onChange={handleChange}
                    />
                  </div>
                )}
                <li
                  className={`hwl ${visible ? "active" : "inactive"}`}
                  onClick={showHwl}
                >
                  Furniture
                </li>
                {showDimensions && (
                  <>
                    <div id="height">
                      <label className="topLabel" onClick={showHwl}>
                        <FontAwesomeIcon icon={faSquareCaretLeft} />
                        Furniture
                      </label>{" "}
                      <br />
                      <label>Height (Cm)</label> <br />
                      <input
                        required
                        type="text"
                        name="Height"
                        placeholder="#Height"
                        onChange={handleChange}
                      />
                    </div>

                    <div id="width">
                      <label>Width (Cm)</label> <br />
                      <input
                        required
                        type="text"
                        name="Width"
                        placeholder="#Width"
                        onChange={handleChange}
                      />
                    </div>
                    <div id="length">
                      <label>Length (Cm)</label> <br />
                      <input
                        required
                        type="text"
                        name="Length"
                        placeholder="#Length"
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
