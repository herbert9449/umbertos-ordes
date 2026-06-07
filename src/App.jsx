import { useState, useEffect } from "react";

export default function App() {
  const [suppliers, setSuppliers] = useState(() => {
    const savedData = localStorage.getItem("umbertosSuppliers");

    if (savedData) {
      return JSON.parse(savedData);
    }

    return {
      Empire: [],
      Southern: [],
      Opici: [],
      Premium: []
    };
  });

  const [selectedSupplier, setSelectedSupplier] = useState("Empire");
  const [newProduct, setNewProduct] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [orderText, setOrderText] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "umbertosSuppliers",
      JSON.stringify(suppliers)
    );
  }, [suppliers]);

  const addSupplier = () => {
    if (!newSupplier.trim()) return;

    if (suppliers[newSupplier]) {
      alert("Supplier already exists");
      return;
    }

    setSuppliers({
      ...suppliers,
      [newSupplier]: []
    });

    setNewSupplier("");
  };

  const deleteSupplier = (supplierName) => {
    if (
      !window.confirm(
        `Delete supplier "${supplierName}" and all products?`
      )
    ) {
      return;
    }

    const updated = { ...suppliers };

    delete updated[supplierName];

    setSuppliers(updated);

    const remaining = Object.keys(updated);

    if (remaining.length > 0) {
      setSelectedSupplier(remaining[0]);
    }
  };
    const addProduct = () => {
    if (!newProduct.trim()) return;

    setSuppliers({
      ...suppliers,
      [selectedSupplier]: [
        ...suppliers[selectedSupplier],
        {
          name: newProduct,
          qty: "",
          unit: "Bottle",
          selected: false
        }
      ]
    });

    setNewProduct("");
  };

  const deleteProduct = (index) => {
    if (!window.confirm("Delete product?")) return;

    const updated = [...suppliers[selectedSupplier]];

    updated.splice(index, 1);

    setSuppliers({
      ...suppliers,
      [selectedSupplier]: updated
    });
  };

  const toggleProduct = (index) => {
    const updated = [...suppliers[selectedSupplier]];

    updated[index].selected = !updated[index].selected;

    setSuppliers({
      ...suppliers,
      [selectedSupplier]: updated
    });
  };

  const updateQty = (index, value) => {
    const updated = [...suppliers[selectedSupplier]];

    updated[index].qty = value;

    setSuppliers({
      ...suppliers,
      [selectedSupplier]: updated
    });
  };

  const updateUnit = (index, value) => {
    const updated = [...suppliers[selectedSupplier]];

    updated[index].unit = value;

    setSuppliers({
      ...suppliers,
      [selectedSupplier]: updated
    });
  };

  const generateOrder = () => {
    let text = `UMBERTO'S ORDER\n\nSupplier: ${selectedSupplier}\n\n`;

    suppliers[selectedSupplier].forEach((item) => {
      if (item.selected) {
        text += `${item.name} - ${item.qty || 1} ${item.unit}\n`;
      }
    });

    setOrderText(text);
  };

  const copyOrder = async () => {
    if (!orderText.trim()) {
      generateOrder();
      return;
    }

    try {
      await navigator.clipboard.writeText(orderText);

      const cleanedProducts =
        suppliers[selectedSupplier].map((item) => ({
          ...item,
          qty: "",
          selected: false,
          unit: "Bottle"
        }));

      setSuppliers({
        ...suppliers,
        [selectedSupplier]: cleanedProducts
      });

      setOrderText("");

      alert("Order copied successfully");
    } catch (err) {
      alert("Copy failed");
    }
  };

  return (
    <div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "#111827",
    color: "white"
  }}
>
  <div
    style={{
      width: "250px",
      background: "#1f2937",
      padding: "20px"
    }}
  >
    <h2>UMBERTO'S</h2>
    <hr />

    <h3>Suppliers</h3>

    <input
      type="text"
      placeholder="New Supplier"
      value={newSupplier}
      onChange={(e) => setNewSupplier(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "10px"
      }}
    />

    <button
      onClick={addSupplier}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "15px"
      }}
    >
      Add Supplier
    </button>

    {Object.keys(suppliers).map((supplier) => (
      <div
        key={supplier}
        style={{
          display: "flex",
          gap: "5px",
          marginBottom: "10px"
        }}
      >
        <button
          onClick={() => setSelectedSupplier(supplier)}
          style={{
            flex: 1,
            padding: "10px",
            cursor: "pointer"
          }}
        >
          {supplier}
        </button>

        <button
          onClick={() => deleteSupplier(supplier)}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer"
          }}
        >
          🗑
        </button>
      </div>
    ))}
  </div>

  <div style={{ flex: 1, padding: "30px" }}>
    <h1>Wine & Liquor Providers</h1>

    <h2>{selectedSupplier}</h2>

    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Add Product"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        style={{
          width: "350px",
          padding: "10px"
        }}
      />

      <button
        onClick={addProduct}
        style={{
          marginLeft: "10px",
          padding: "10px"
        }}
      >
        Add
      </button>
    </div>

    <h3>Products</h3>

    {suppliers[selectedSupplier]?.map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px"
        }}
      >
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => toggleProduct(index)}
        />

        <div style={{ width: "300px" }}>
          {item.name}
        </div>

        <button
          onClick={() => deleteProduct(index)}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer"
          }}
        >
          🗑
        </button>

        <input
          type="number"
          placeholder="Qty"
          value={item.qty}
          onChange={(e) =>
            updateQty(index, e.target.value)
          }
          style={{
            width: "80px"
          }}
        />

        <select
          value={item.unit}
          onChange={(e) =>
            updateUnit(index, e.target.value)
          }
        >
          <option>Bottle</option>
          <option>Case</option>
        </select>
      </div>
    ))}

    <br />

    <button
      onClick={generateOrder}
      style={{
        padding: "12px",
        marginRight: "10px"
      }}
    >
      Generate Order
    </button>

    <button
      onClick={copyOrder}
      style={{
        padding: "12px",
        background: "#16a34a",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}
    >
      Copy Order & Clear
    </button>

    <div style={{ marginTop: "30px" }}>
      <h3>Order Preview</h3>

      <textarea
        rows="12"
        value={orderText}
        readOnly
        style={{
          width: "100%",
          maxWidth: "800px"
        }}
      />
    </div>
  </div>
</div>
);
} 