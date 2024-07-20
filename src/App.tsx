import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddProducts from "./pages/addProducts/AddProducts";
import Products from "./pages/ProductsPage/Products";

import "./App.css";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/home" element={<Products />} />
          <Route path="/addProducts" element={<AddProducts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
