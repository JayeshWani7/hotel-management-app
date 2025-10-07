"use client";
import { useState, useEffect } from "react";
import { Button, Box, Typography, IconButton, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import { Link } from "react-router-dom";

// Cart Component
export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Fetch cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Handle item removal
  const handleRemoveItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Increase item quantity
  const handleIncreaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease item quantity
  const handleDecreaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle checkout
  const handleCheckout = () => {
    const currentOrder = [...cart];
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    orderHistory.push({ id: new Date().getTime(), items: currentOrder, date: new Date().toLocaleString() });

    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    localStorage.removeItem("cart");
    setCart([]);
  
    alert("Order placed successfully!");
  };
  

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      {/* AppBar */}
      <Box sx={{ backgroundColor: "#fff", padding: 2, boxShadow: 1, marginBottom: 2 }}>
        <Typography variant="h6" fontFamily="mono" align="center">Your Cart</Typography>
      </Box>

      <main className="mx-auto max-w-5xl px-4 py-12">
        {cart.length === 0 ? (
          <Typography variant="h5" color="text.secondary" align="center">
            Your cart is empty. Please add some items.
          </Typography>
        ) : (
          <>
            {/* Cart Table */}
            <TableContainer sx={{ marginBottom: 3, boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <img src={item.image} alt={item.name} style={{ width: 50, height: 50, marginRight: 10, objectFit: "cover" }} />
                          <Typography variant="body2">{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </TableCell>
                      <TableCell align="center">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <IconButton color="primary" onClick={() => handleDecreaseQuantity(item.id)}>
                            <RemoveCircleOutlinedIcon />
                          </IconButton>
                          <Typography variant="body2" sx={{ marginX: 2 }}>{item.quantity}</Typography>
                          <IconButton color="primary" onClick={() => handleIncreaseQuantity(item.id)}>
                            <AddCircleIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="center">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                          <RemoveCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Cart Summary */}
            <Divider sx={{ marginY: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ width: "30%" }}>
                Checkout
              </Button>
            </Box>
          </>
        )}
      </main>
    </div>
  );
}
